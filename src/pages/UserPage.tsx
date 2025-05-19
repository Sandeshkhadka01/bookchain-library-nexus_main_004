import React, { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/use-wallet';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, BorrowHistory } from '@/types/book';
import { BlockchainService } from '@/services/mockBlockchain';

const UserPage: React.FC = () => {
  const { connected, address } = useWallet();
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [borrowHistory, setBorrowHistory] = useState<BorrowHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (connected && address) {
        setLoading(true);
        try {
          // Fetch all books
          const allBooks = await BlockchainService.getBooks();
          // Filter books borrowed by current user
          const userBorrowedBooks = allBooks.filter(
            book => !book.available && book.borrower === address
          );
          setBorrowedBooks(userBorrowedBooks);
          
          // Fetch user's borrowing history
          const history = await BlockchainService.getUserBorrowHistory(address);
          setBorrowHistory(history);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [connected, address]);

  const handleReturnBook = async (bookId: string) => {
    if (!connected || !address) return;
    
    try {
      await BlockchainService.returnBook(bookId, address);
      // Update the UI after returning
      setBorrowedBooks(prev => prev.filter(book => book.id !== bookId));
      
      // Update the history
      const allBooks = await BlockchainService.getBooks();
      const userBorrowedBooks = allBooks.filter(
        book => !book.available && book.borrower === address
      );
      setBorrowedBooks(userBorrowedBooks);
      
      const history = await BlockchainService.getUserBorrowHistory(address);
      setBorrowHistory(history);
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };

  if (!connected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
        <p className="text-library-muted mb-4">Please connect your wallet to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-library-text mb-8">User Dashboard</h1>
      
      {connected && address && (
        <div className="mb-8 px-4 py-3 bg-library-primary/5 rounded-lg border border-library-primary/10">
          <p className="text-sm text-library-muted">Connected Address:</p>
          <p className="font-mono text-library-primary">
            {address}
          </p>
        </div>
      )}
      
      <Tabs defaultValue="current-books" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-2">
          <TabsTrigger value="current-books">Currently Borrowed</TabsTrigger>
          <TabsTrigger value="borrow-history">Borrowing History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current-books">
          <Card>
            <CardHeader>
              <CardTitle>Currently Borrowed Books</CardTitle>
              <CardDescription>
                Books you currently have checked out from the library.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-pulse text-library-primary">Loading books...</div>
                </div>
              ) : borrowedBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            Borrowed on: {book.borrowDate ? new Date(book.borrowDate).toLocaleDateString() : 'Unknown date'}
                          </p>
                        </div>
                        <div className="mt-4">
                          <Button 
                            onClick={() => handleReturnBook(book.id)}
                            size="sm"
                            className="w-full"
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
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-pulse text-library-primary">Loading history...</div>
                </div>
              ) : borrowHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left text-sm font-medium text-library-muted">Book</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-library-muted">Borrow Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-library-muted">Return Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-library-muted">TX Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {borrowHistory.map((record, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-3 text-sm">{record.bookTitle}</td>
                          <td className="px-4 py-3 text-sm">
                            {new Date(record.borrowDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {record.returnDate 
                              ? new Date(record.returnDate).toLocaleDateString() 
                              : "Not returned"}
                          </td>
                          <td className="px-4 py-3 text-sm font-mono">
                            {record.transactionHash.slice(0, 6)}...{record.transactionHash.slice(-4)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
  );
};

export default UserPage;
