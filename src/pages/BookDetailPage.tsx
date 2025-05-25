import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Book } from '@/types/book';
// Removed: import { BlockchainService } from '@/services/mockBlockchain';
import * as BlockchainService from '@/services/blockchainService';
import BookDetail from '@/components/books/BookDetail';
import { ArrowLeft } from 'lucide-react';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBook = async () => {
    console.log('BookDetailPage id:', id);
    if (!id || id === 'undefined' || isNaN(Number(id))) {
      setError("Invalid or missing book ID");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const bookData = await BlockchainService.getBook(id);
      console.log('BookDetailPage bookData:', bookData);
      if (!bookData || bookData.id === undefined || bookData.id === null || bookData.id === '' || bookData.id === 'undefined') {
        setError("Book not found or missing ID");
        setBook(null);
        return;
      }
      setBook(bookData);
      setError(null);
    } catch (err: any) {
      setError("Book not found or contract call failed. " + (err?.reason || err?.message || ''));
      setBook(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Button 
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold text-library-text">Book Details</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse text-library-primary">Loading book details...</div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-12">
          {error}
        </div>
      ) : book ? (
        <BookDetail book={book} onBookUpdate={fetchBook} />
      ) : (
        <div className="text-center py-12">
          <p className="text-library-muted text-lg">Book not found</p>
        </div>
      )}
    </div>
  );
};

export default BookDetailPage;
