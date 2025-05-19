import React from 'react';
import { Book, BookOpen, History, Library, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="animate-fade-in space-y-12 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-library-text mb-6 bg-clip-text text-transparent bg-gradient-to-r from-library-primary to-library-secondary">
          About DecentraLib
        </h1>
        <p className="text-xl text-library-muted max-w-2xl mx-auto">
          A revolutionary decentralized library built on blockchain technology, ensuring transparency, 
          security, and accessibility for all readers.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-r from-library-primary/5 to-library-secondary/5 p-8 rounded-2xl">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3 flex justify-center">
            <div className="w-40 h-40 rounded-full bg-library-primary/10 flex items-center justify-center">
              <BookOpen className="w-20 h-20 text-library-primary" />
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-4 text-library-text">Our Mission</h2>
            <p className="text-library-muted">
              DecentraLib aims to revolutionize how libraries operate by leveraging blockchain technology to create
              a transparent, secure, and efficient system for book lending and management. We believe in democratizing 
              access to knowledge while ensuring proper record-keeping of all transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center text-library-text">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="feature-card stagger-item">
            <div className="feature-icon-wrapper">
              <Shield className="text-library-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Blockchain Security</h3>
            <p className="text-library-muted">
              All borrowing records are stored on the blockchain, ensuring transparency and immutability.
            </p>
          </div>
          
          <div className="feature-card stagger-item">
            <div className="feature-icon-wrapper">
              <Book className="text-library-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Decentralized Storage</h3>
            <p className="text-library-muted">
              Book metadata and covers are stored permanently on IPFS, ensuring they are always accessible.
            </p>
          </div>
          
          <div className="feature-card stagger-item">
            <div className="feature-icon-wrapper">
              <History className="text-library-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Transparent History</h3>
            <p className="text-library-muted">
              Complete visibility into the borrowing history of each book, maintained with blockchain integrity.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-library-primary to-library-secondary p-8 rounded-2xl text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Experience DecentraLib?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Join our community of readers and experience the future of decentralized libraries.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button variant="secondary" onClick={() => navigate('/')}>
            Back to Home
          </Button>
          <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" onClick={() => navigate('/books')}>
            Browse Books
          </Button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-library-text">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { 
              q: 'How does DecentraLib use blockchain technology?',
              a: 'DecentraLib uses blockchain to record all book borrowing transactions, ensuring a transparent and immutable record of who borrowed what book and when. This eliminates disputes and creates a trustless system.'
            },
            { 
              q: 'Do I need cryptocurrency to use DecentraLib?',
              a: 'Yes, you need a small amount of cryptocurrency to cover transaction fees when borrowing or returning books. These fees are minimal and help maintain the decentralized nature of our platform.'
            },
            { 
              q: 'How are the books stored?',
              a: 'Book metadata and covers are stored on IPFS (InterPlanetary File System), a distributed file system. The physical books are still maintained in traditional libraries, but all transactions are recorded on the blockchain.'
            }
          ].map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 stagger-item">
              <h3 className="font-semibold text-lg mb-2 text-library-text">{faq.q}</h3>
              <p className="text-library-muted">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
