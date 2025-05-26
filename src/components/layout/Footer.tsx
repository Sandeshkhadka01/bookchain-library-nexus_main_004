import React from 'react';
import { BookOpen, Github, Home, Library, Info, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-auto py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <BookOpen className="h-5 w-5 text-library-primary mr-2" />
            <span className="text-library-text font-semibold">DecentraLib</span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Link to="/" className="flex items-center text-library-muted hover:text-library-primary transition-colors">
              <Home className="h-4 w-4 mr-1" /> Home
            </Link>
            <Link to="/books" className="flex items-center text-library-muted hover:text-library-primary transition-colors">
              <Library className="h-4 w-4 mr-1" /> Browse
            </Link>
            <Link to="/about" className="flex items-center text-library-muted hover:text-library-primary transition-colors">
              <Info className="h-4 w-4 mr-1" /> About
            </Link>
            <Link to="/admin" className="flex items-center text-library-muted hover:text-library-primary transition-colors">
              <Settings className="h-4 w-4 mr-1" /> Admin
            </Link>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link to="/terms" className="text-library-muted hover:text-library-primary transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-library-muted hover:text-library-primary transition-colors">
              Privacy
            </Link>
            <Link to="/documentation" className="text-library-muted hover:text-library-primary transition-colors">
              Documentation
            </Link>
            <a href="https://github.com/Sandeshkhadka01" target="_blank" rel="noopener noreferrer" className="flex items-center text-library-muted hover:text-library-primary transition-colors">
              <Github className="h-4 w-4 mr-1" /> GitHub
            </a>
          </div>
        </div>
        <div className="text-sm text-library-muted text-center mt-6">
          &copy; {new Date().getFullYear()} DecentraLib. Built on blockchain technology.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
