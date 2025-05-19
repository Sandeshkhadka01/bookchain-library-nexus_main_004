import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Book } from '@/types/book';
import { BlockchainService } from '@/services/mockBlockchain';
import BookDetail from '@/components/books/BookDetail';
import { ArrowLeft } from 'lucide-react';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBook = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const bookData = await BlockchainService.getBook(id);
      if (!bookData) {
        setError("Book not found");
        return;
      }
      setBook(bookData);
    } catch (err) {
      setError("Error fetching book details");
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
