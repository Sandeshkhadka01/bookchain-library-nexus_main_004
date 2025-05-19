import React from 'react';
import { Book } from '@/types/book';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWallet } from '@/hooks/use-wallet';
import { Calendar, BookOpen, User, Archive } from 'lucide-react';
import { BlockchainService } from '@/services/mockBlockchain';
import { toast } from 'sonner';

interface BookDetailProps {
  book: Book;
  onBookUpdate: () => void;
}

const BookDetail: React.FC<BookDetailProps> = ({ book, onBookUpdate }) => {
  const { connected, address } = useWallet();

  const handleBorrow = async () => {
    if (!connected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      await BlockchainService.borrowBook(book.id, address);
      onBookUpdate();
      toast.success("Book borrowed successfully");
    } catch (error) {
      console.error("Error borrowing book:", error);
      toast.error("Failed to borrow book");
    }
  };

  const handleReturn = async () => {
    if (!connected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      await BlockchainService.returnBook(book.id, address);
      onBookUpdate();
      toast.success("Book returned successfully");
    } catch (error) {
      console.error("Error returning book:", error);
      toast.error("Failed to return book");
    }
  };

  const isUserBorrower = book.borrowers?.some(b => b.address === address);
  const isAvailable = book.availableCopies > 0;

  return (
    <Card className="overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3 relative">
          <img 
            src={book.coverImage} 
            alt={`${book.title} cover`} 
            className="w-full h-96 object-cover"
          />
          <div className={`absolute top-2 right-2 text-sm px-3 py-1 rounded-full ${
            isAvailable ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {isAvailable ? `${book.availableCopies} of ${book.quantity} Available` : 'All Copies Borrowed'}
          </div>
        </div>
        
        <div className="p-6 md:w-2/3">
          <h1 className="text-3xl font-semibold text-library-text">{book.title}</h1>
          <p className="text-library-muted mt-2">{book.author}</p>
          
          <div className="mt-6 space-y-4">
            <p className="text-library-text">{book.description}</p>
            
            <div className="flex items-center text-sm text-library-muted">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>Total Copies: {book.quantity}</span>
            </div>
            
            {book.borrowers && book.borrowers.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-library-muted">
                  Currently Borrowed Copies: {book.borrowers.length}
                </p>
                {isUserBorrower && (
                  <p className="text-sm text-green-600">
                    You have borrowed this book
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-8 flex space-x-4">
            {isAvailable && connected && !isUserBorrower ? (
              <Button onClick={handleBorrow}>
                <BookOpen className="mr-2 h-4 w-4" />
                Borrow
              </Button>
            ) : isUserBorrower ? (
              <Button onClick={handleReturn}>
                Return Book
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookDetail;
