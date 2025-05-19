
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useWallet } from '@/hooks/use-wallet';
import { 
  BookOpen,
  Home,
  Library,
  Settings,
  Info
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { connected, address, connectWallet, disconnectWallet } = useWallet();

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-library-primary" />
            <Link to="/" className="text-xl font-bold text-library-text">
              DecentraLib
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 text-library-text hover:text-library-primary transition-colors">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link to="/books" className="flex items-center space-x-1 text-library-text hover:text-library-primary transition-colors">
              <Library className="h-4 w-4" />
              <span>Browse</span>
            </Link>
            <Link to="/about" className="flex items-center space-x-1 text-library-text hover:text-library-primary transition-colors">
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>
            <Link to="/admin" className="flex items-center space-x-1 text-library-text hover:text-library-primary transition-colors">
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </div>

          <div>
            {connected ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-library-muted hidden md:inline">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <Button variant="outline" onClick={disconnectWallet}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={connectWallet}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
