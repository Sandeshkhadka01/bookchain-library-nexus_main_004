import React, { useState } from 'react';
import BookCard from './BookCard';
import { Book } from '@/types/book';
import { borrowBook } from '@/services/blockchainService';
import { useWallet } from '@/hooks/use-wallet';
import { toast } from 'sonner';

interface BookGridProps {
  books: Book[];
  refreshBooks: () => void;
}

const BookGrid: React.FC<BookGridProps> = ({ books, refreshBooks }) => {
  const { connected, address } = useWallet();
  const [loadingBookId, setLoadingBookId] = useState<string | null>(null);

  // Count skipped books due to missing IDs
  let skippedBooks = 0;

  const handleBorrow = async (bookId: string) => {
    if (!connected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }
    setLoadingBookId(bookId);
    try {
      await borrowBook(bookId);
      refreshBooks();
    } catch (error) {
      console.error("Error borrowing book:", error);
      toast.error("Failed to borrow book");
    } finally {
      setLoadingBookId(null);
    }
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-library-muted text-lg">No books available.</p>
      </div>
    );
  }

  const bookCards = books.map((book) => {
    try {
      if (book.id === undefined || book.id === null || book.id === '' || book.id === 'undefined') {
        skippedBooks++;
        console.warn('BookGrid: Book missing id:', book);
        return null;
      }
      return (
        <BookCard 
          key={book.id} 
          book={book} 
          onBorrow={handleBorrow}
          borrowLoading={loadingBookId === book.id}
        />
      );
    } catch (err) {
      console.error('Error rendering book in BookGrid:', book, err);
      return null;
    }
  });

  // Show a warning toast if any books were skipped
  React.useEffect(() => {
    if (skippedBooks > 0) {
      toast.warning(`${skippedBooks} book(s) could not be displayed due to missing IDs.`);
    }
    // Only run on mount or when books change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {bookCards}
    </div>
  );
};

export default BookGrid;
