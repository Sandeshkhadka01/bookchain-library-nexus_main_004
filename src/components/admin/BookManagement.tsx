import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Book, BookFormData } from '@/types/book';
import { Search, Plus, Edit, Trash2, History, Download } from 'lucide-react';
import { toast } from "sonner";
import AddEditBookForm from '../admin/AddEditBookForm';
import BookHistoryDialog from '../admin/BookHistoryDialog';

interface BookManagementProps {
  books: Book[];
  isLoading: boolean;
  onAddBook: (book: Omit<Book, 'id'>) => Promise<void>;
  onEditBook: (id: string, book: Partial<Book>) => Promise<void>;
  onDeleteBook: (id: string) => Promise<void>;
}

const BookManagement = ({
  books,
  isLoading,
  onAddBook,
  onEditBook,
  onDeleteBook
}: BookManagementProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredBooks, setFilteredBooks] = React.useState<Book[]>(books);
  const [selectedBook, setSelectedBook] = React.useState<Book | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = React.useState(false);

  const safeToLower = (val: string | undefined | null) => (val ? val.toLowerCase() : '');

  React.useEffect(() => {
    const filtered = books.filter(book => 
      safeToLower(book.title).includes(safeToLower(searchTerm)) ||
      safeToLower(book.author).includes(safeToLower(searchTerm)) ||
      book.isbn.includes(searchTerm)
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const handleExportCSV = () => {
    const headers = ['Title', 'Author', 'ISBN', 'Genre', 'Quantity', 'Available Copies', 'Current Borrowers'];
    const csvContent = [
      headers.join(','),
      ...filteredBooks.map(book => [
        book.title,
        book.author,
        book.isbn,
        book.genre,
        book.quantity,
        book.availableCopies,
        book.borrowers?.length || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'books_export.csv';
    link.click();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await onDeleteBook(id);
        setFilteredBooks(prev => prev.filter(book => book.id !== id));
        toast.success('Book deleted successfully');
      } catch (error) {
        console.error('Error deleting book:', error);
        toast.error('Failed to delete book');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search books..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogDescription>
                  Fill in the book details below to add it to the library.
                </DialogDescription>
              </DialogHeader>
              <AddEditBookForm
                onSubmit={async (bookData: BookFormData) => {
                  await onAddBook({
                    ...bookData,
                    availableCopies: bookData.quantity,
                    metadataUrl: bookData.metadataUrl,
                  });
                  setIsAddDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="animate-pulse text-library-primary">Loading books...</div>
                </TableCell>
              </TableRow>
            ) : filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No books found
                </TableCell>
              </TableRow>
            ) : (
              filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.quantity}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      book.availableCopies > 0
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {book.availableCopies > 0 
                        ? `${book.availableCopies} of ${book.quantity} Available` 
                        : 'All Copies Borrowed'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedBook(book);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(book.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedBook(book);
                          setIsHistoryDialogOpen(true);
                        }}
                      >
                        <History className="h-4 w-4" />
                      </Button>
                      {book.metadataUrl && (
                        <a
                          href={book.metadataUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View IPFS Metadata"
                          className="inline-flex items-center justify-center p-2 rounded hover:bg-gray-100 transition-colors"
                          style={{ lineHeight: 0 }}
                        >
                          <span className="sr-only">View IPFS Metadata</span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12l-6-6m0 0l6 6m-6-6v12" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Update the book details below.
            </DialogDescription>
          </DialogHeader>
          {selectedBook && (
            <AddEditBookForm
              book={selectedBook}
              onSubmit={async (bookData) => {
                await onEditBook(selectedBook.id, {
                  ...bookData,
                  metadataUrl: bookData.metadataUrl,
                });
                setIsEditDialogOpen(false);
                setSelectedBook(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {selectedBook && (
        <BookHistoryDialog
          book={selectedBook}
          isOpen={isHistoryDialogOpen}
          onClose={() => {
            setIsHistoryDialogOpen(false);
            setSelectedBook(null);
          }}
        />
      )}
    </div>
  );
};

export default BookManagement; 