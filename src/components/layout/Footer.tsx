
import React from 'react';
import { BookOpen } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-auto py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <BookOpen className="h-5 w-5 text-library-primary mr-2" />
            <span className="text-library-text font-semibold">DecentraLib</span>
          </div>
          
          <div className="text-sm text-library-muted">
            &copy; {new Date().getFullYear()} DecentraLib. Built on blockchain technology.
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-library-muted hover:text-library-primary transition-colors">
              Terms
            </a>
            <a href="#" className="text-library-muted hover:text-library-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-library-muted hover:text-library-primary transition-colors">
              Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
