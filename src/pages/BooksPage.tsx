import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BookGrid from '@/components/books/BookGrid';
import { Book, BorrowHistory } from '@/types/book';
// Removed: import { BlockchainService } from '@/services/mockBlockchain';
import * as BlockchainService from '@/services/blockchainService';
import { Search, Book as BookIcon, History, BookOpen } from 'lucide-react';
import { useWallet } from '@/hooks/use-wallet';
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

// ErrorBoundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12 text-red-500">
          <h2>Something went wrong in the Books page.</h2>
          <pre style={{whiteSpace: 'pre-wrap'}}>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const BooksPage: React.FC = () => {
  const { connected, address } = useWallet();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [borrowHistory, setBorrowHistory] = useState<BorrowHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { books: booksData, skippedBooks, metadataErrors } = await BlockchainService.getBooks();
      // Sort by ID descending (latest first)
      booksData.sort((a, b) => Number(b.id) - Number(a.id));
      setBooks(booksData);
      setFilteredBooks(booksData);
      if (skippedBooks > 0) {
        toast.warning(`${skippedBooks} book(s) could not be loaded due to missing or invalid metadata.`);
      }
      if (metadataErrors > 0) {
        toast.warning(`${metadataErrors} book(s) had issues fetching metadata from IPFS.`);
      }
      // Filter borrowed books
      if (connected && address) {
        const userBorrowedBooks = booksData.filter(book => 
          book.borrowers?.some(borrower => 
            typeof borrower === 'string'
              ? borrower.toLowerCase() === address.toLowerCase()
              : borrower?.address?.toLowerCase() === address.toLowerCase()
          )
        );
        setBorrowedBooks(userBorrowedBooks);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to fetch books. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBorrowHistory = async () => {
    if (!connected || !address) return;
    
    setHistoryLoading(true);
    try {
      const history = await BlockchainService.getUserBorrowHistory(address);
      setBorrowHistory(history);
    } catch (error) {
      console.error("Error fetching borrow history:", error);
      toast.error("Failed to fetch borrowing history. Please try again later.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleReturnBook = async (bookId: string) => {
    if (!connected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      await BlockchainService.returnBook(bookId);
      // Refresh the books list
      await fetchBooks();
      // Refresh the borrow history
      await fetchBorrowHistory();
      toast.success("Book returned successfully");
    } catch (error) {
      console.error("Error returning book:", error);
      toast.error("Failed to return book");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchBorrowHistory();
  }, [connected, address]);

  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(lowercaseSearchTerm) ||
        book.author.toLowerCase().includes(lowercaseSearchTerm)
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  }, [searchTerm, books]);

  const validBooks = filteredBooks.filter(
    (book) => {
      // Exclude books with missing, empty, or invalid IDs
      if (!book.id || book.id === 'undefined' || isNaN(Number(book.id))) return false;
      // Exclude books with missing or empty metadataURI, title, or coverImage
      if (!book.metadataUrl || !book.title || !book.coverImage) return false;
      return true;
    }
  );

  return (
    <ErrorBoundary>
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-library-text mb-8">Browse Books</h1>
      
      <div className="relative mb-8">
        <Label htmlFor="search-books" className="sr-only">Search books by title or author</Label>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          id="search-books"
          placeholder="Search by title or author..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all-books" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-3">
          <TabsTrigger value="all-books" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>All Books</span>
          </TabsTrigger>
          <TabsTrigger value="borrowed-books" className="flex items-center gap-2">
            <BookIcon className="h-4 w-4" />
            <span>Borrowed Books</span>
          </TabsTrigger>
          <TabsTrigger value="borrow-history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>Borrowing History</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-books">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-library-primary">Loading books...</div>
            </div>
            ) : validBooks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-library-muted text-lg">No books available. Please check your book metadata in the admin panel.</p>
              </div>
          ) : (
              <BookGrid books={validBooks} refreshBooks={fetchBooks} />
          )}
        </TabsContent>
        
        <TabsContent value="borrowed-books">
          <Card>
            <CardHeader>
              <CardTitle>Currently Borrowed Books</CardTitle>
              <CardDescription>
                Books you currently have checked out from the library.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!connected ? (
                <div className="text-center py-12">
                  <p className="text-library-muted mb-4">Please connect your wallet to view your borrowed books.</p>
                </div>
              ) : loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-pulse text-library-primary">Loading borrowed books...</div>
                </div>
              ) : borrowedBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {borrowedBooks.map((book) => (
                    <div key={book.id} className="book-card flex flex-col h-full">
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img 
                          src={book.coverImage} 
                          alt={book.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex-1">
                          <h3 className="font-semibold text-library-text line-clamp-1">{book.title}</h3>
                          <p className="text-sm text-library-muted mb-2">{book.author}</p>
                          <p className="text-xs text-library-muted">
                            Borrowed on: {book.borrowers?.find(b => b.address === address)?.borrowDate.toLocaleDateString() || 'Unknown date'}
                          </p>
                        </div>
                        <div className="mt-4">
                          <Button 
                            onClick={() => handleReturnBook(book.id)}
                            className="w-full"
                            variant="secondary"
                          >
                            Return Book
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-library-muted">You don't have any borrowed books.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="borrow-history">
          <Card>
            <CardHeader>
              <CardTitle>Borrowing History</CardTitle>
              <CardDescription>
                Complete history of all your book borrowing transactions on the blockchain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!connected ? (
                <div className="text-center py-12">
                  <p className="text-library-muted mb-4">Please connect your wallet to view your borrowing history.</p>
                </div>
              ) : historyLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-pulse text-library-primary">Loading history...</div>
                </div>
              ) : borrowHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Book</TableHead>
                        <TableHead>Borrow Date</TableHead>
                        <TableHead>Return Date</TableHead>
                        <TableHead>Transaction Hash</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {borrowHistory.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{record.bookTitle}</TableCell>
                          <TableCell>
                            {new Date(record.borrowDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {record.returnDate 
                              ? new Date(record.returnDate).toLocaleDateString() 
                              : "Not returned"}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {record.transactionHash
                              ? `${record.transactionHash.slice(0, 6)}...${record.transactionHash.slice(-4)}`
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-library-muted">No borrowing history found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </ErrorBoundary>
  );
};

export default BooksPage;
