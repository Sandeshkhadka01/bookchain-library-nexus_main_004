
import React from 'react';
import BookCard from './BookCard';
import { Book } from '@/types/book';
import { BlockchainService } from '@/services/mockBlockchain';
import { useWallet } from '@/hooks/use-wallet';
import { toast } from 'sonner';

interface BookGridProps {
  books: Book[];
  refreshBooks: () => void;
}

const BookGrid: React.FC<BookGridProps> = ({ books, refreshBooks }) => {
  const { connected, address } = useWallet();

  const handleBorrow = async (bookId: string) => {
    if (!connected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      await BlockchainService.borrowBook(bookId, address);
      refreshBooks();
    } catch (error) {
      console.error("Error borrowing book:", error);
      toast.error("Failed to borrow book");
    }
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-library-muted text-lg">No books available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard 
          key={book.id} 
          book={book} 
          onBorrow={handleBorrow}
        />
      ))}
    </div>
  );
};

export default BookGrid;
