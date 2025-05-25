import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '@/types/book';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/use-wallet';
import { Calendar } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onBorrow?: (bookId: string) => void;
  borrowLoading?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, onBorrow, borrowLoading }) => {
  const navigate = useNavigate();
  const { connected } = useWallet();

  const handleViewDetails = () => {
    if (book.id === undefined || book.id === null || book.id === '' || book.id === 'undefined') {
      console.warn('BookCard: Tried to view details for book with missing id:', book);
      return;
    }
    navigate(`/books/${book.id}`);
  };

  const handleBorrow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBorrow) {
      onBorrow(book.id);
    }
  };

  const isAvailable = book.availableCopies > 0;

  return (
    <div 
      className="book-card cursor-pointer" 
      onClick={handleViewDetails}
    >
      <div className="relative">
        <img 
          src={book.coverImage} 
          alt={`${book.title} cover`} 
          className="book-cover"
        />
        <div className={`book-status ${isAvailable ? 'status-available' : 'status-borrowed'}`}>
          {isAvailable ? `${book.availableCopies} of ${book.quantity} Available` : 'All Copies Borrowed'}
        </div>
      </div>
      
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        
        {book.borrowers && book.borrowers.length > 0 && (
          <div className="flex items-center text-xs text-library-muted mt-2">
            <Calendar className="h-3 w-3 mr-1" />
            <span>
              {book.borrowers.length} {book.borrowers.length === 1 ? 'copy' : 'copies'} borrowed
            </span>
          </div>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewDetails}
            disabled={book.id === undefined || book.id === null || book.id === '' || book.id === 'undefined'}
          >
            Details
          </Button>
          
          {isAvailable && connected && (
            <Button 
              size="sm" 
              onClick={handleBorrow} 
              className="ml-2"
              disabled={borrowLoading}
            >
              {borrowLoading ? 'Borrowing...' : 'Borrow'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
