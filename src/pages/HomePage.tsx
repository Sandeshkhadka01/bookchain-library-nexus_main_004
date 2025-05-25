import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, BookMarked, Shield, Database, Info } from 'lucide-react';
import { useWallet } from '@/hooks/use-wallet';
import { Book } from '@/types/book';
// Removed: import { BlockchainService } from '@/services/mockBlockchain';
import * as BlockchainService from '@/services/blockchainService';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { connected, connectWallet } = useWallet();
  const [latestBooks, setLatestBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        const { books } = await BlockchainService.getBooks();
        // Sort by newest (using ID as proxy since higher IDs are assumed to be newer)
        const sorted = [...books].sort((a, b) => parseInt(b.id) - parseInt(a.id));
        setLatestBooks(sorted.slice(0, 3)); // Get the 3 most recent books
      } catch (error) {
        console.error("Error fetching latest books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBooks();
  }, []);

  const validBooks = latestBooks.filter(
    (book) => book.id && book.title && book.coverImage
  );

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-20 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-library-text mb-6 bg-clip-text text-transparent bg-gradient-to-r from-library-primary to-library-secondary">
          Welcome to DecentraLib
        </h1>
        <p className="text-xl text-library-muted mb-10 max-w-2xl mx-auto">
          A decentralized library management system built on blockchain technology.
          Borrow books with immutable records, secure storage, and transparent history.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg"
            onClick={() => navigate('/books')}
            className="px-8 btn-hover-effect group"
          >
            Browse Books
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          
          {!connected && (
            <Button 
              variant="outline" 
              size="lg" 
              onClick={connectWallet}
              className="px-8 btn-hover-effect"
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>

      {/* Latest Additions Section */}
      <div className="mb-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-library-text">Latest Additions</h2>
          <Button variant="ghost" onClick={() => navigate('/books')} className="group">
            View All 
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-library-primary">Loading latest books...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {validBooks.map((book) => {
              if (!book.id || book.id === 'undefined') {
                console.warn('Book missing id:', book);
                return null;
              }
              return (
              <div key={book.id} className="book-card stagger-item">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className={`book-status ${book.availableCopies > 0 ? 'status-available' : 'status-borrowed'}`}>
                    {book.availableCopies > 0 
                      ? `${book.availableCopies} of ${book.quantity} Available` 
                      : 'All Copies Borrowed'
                    }
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-library-text line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-library-muted">{book.author}</p>
                  {book.borrowers && book.borrowers.length > 0 && (
                    <div className="flex items-center text-xs text-library-muted mt-2">
                      <BookMarked className="h-3 w-3 mr-1" />
                      <span>
                        {book.borrowers.length} {book.borrowers.length === 1 ? 'copy' : 'copies'} borrowed
                      </span>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/books/${book.id}`)}
                    className="w-full mt-3"
                  >
                    View Details
                  </Button>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Feature Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="feature-card stagger-item">
          <div className="feature-icon-wrapper group-hover:bg-library-primary/20">
            <BookMarked className="text-library-primary h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Decentralized Borrowing</h2>
          <p className="text-library-muted">
            All borrowing records are stored on the blockchain, ensuring transparency and immutability.
          </p>
        </div>
        
        <div className="feature-card stagger-item">
          <div className="feature-icon-wrapper">
            <Database className="text-library-primary h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">IPFS Storage</h2>
          <p className="text-library-muted">
            Book metadata and covers are stored permanently on IPFS, ensuring they are always accessible.
          </p>
        </div>
        
        <div className="feature-card stagger-item">
          <div className="feature-icon-wrapper">
            <Shield className="text-library-primary h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Web3 Authentication</h2>
          <p className="text-library-muted">
            Connect with your Web3 wallet for secure authentication and blockchain transactions.
          </p>
        </div>
      </div>

      {/* How It Works Section with About Link */}
      <div className="bg-gradient-to-r from-library-primary/5 to-library-secondary/5 p-8 rounded-2xl shadow-sm border border-library-accent/10 mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-center text-library-text">How It Works</h2>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/about')} 
            className="group flex items-center gap-1 text-library-primary"
          >
            <Info className="h-4 w-4" />
            <span>Learn More</span>
            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 stagger-item">
            <div className="bg-library-primary text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4 shadow-md shadow-library-primary/30">
              1
            </div>
            <h3 className="font-medium mb-2">Connect Wallet</h3>
            <p className="text-sm text-library-muted">
              Connect your Web3 wallet to authenticate and interact with the blockchain.
            </p>
          </div>
          
          <div className="text-center p-4 stagger-item">
            <div className="bg-library-primary text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4 shadow-md shadow-library-primary/30">
              2
            </div>
            <h3 className="font-medium mb-2">Browse Books</h3>
            <p className="text-sm text-library-muted">
              Explore the decentralized library catalog to find your next read.
            </p>
          </div>
          
          <div className="text-center p-4 stagger-item">
            <div className="bg-library-primary text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4 shadow-md shadow-library-primary/30">
              3
            </div>
            <h3 className="font-medium mb-2">Borrow Book</h3>
            <p className="text-sm text-library-muted">
              Initiate a blockchain transaction to borrow the book of your choice.
            </p>
          </div>
          
          <div className="text-center p-4 stagger-item">
            <div className="bg-library-primary text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4 shadow-md shadow-library-primary/30">
              4
            </div>
            <h3 className="font-medium mb-2">Return Book</h3>
            <p className="text-sm text-library-muted">
              Return the book with another transaction, completing the cycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
