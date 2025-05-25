import React, { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/use-wallet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, BorrowHistory } from '@/types/book';
import { getBooks, addBook, updateBook, deleteBook, getBorrowHistory, isAdmin, getAllUsers } from '@/services/blockchainService';
import { toast } from 'sonner';
import AdminDashboard from '@/components/admin/AdminDashboard';
import UserManagement from '@/components/admin/UserManagement';
import BookManagement from '@/components/admin/BookManagement';
import BorrowHistoryView from '@/components/admin/BorrowHistoryView';

// Interface for User data for UserManagement component
interface User {
  address: string;
  isAdmin: boolean;
  totalBorrowed: number;
  currentlyBorrowed: number;
  lastActive: Date;
}

const AdminPage: React.FC = () => {
  const { connected, address } = useWallet();
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [borrowHistory, setBorrowHistory] = useState<BorrowHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (connected && address) {
        try {
          const result = await isAdmin(address);
          setAdmin(result);
        } catch {
          setAdmin(false);
        }
      } else {
        setAdmin(null);
      }
    };
    checkAdmin();
  }, [connected, address]);

  useEffect(() => {
    if (connected && admin) {
      fetchBooks();
      fetchUsers();
      fetchBorrowHistory();
    }
  }, [connected, admin]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { books: booksData } = await getBooks();
      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const userAddresses = await getAllUsers();
      setUsers(userAddresses.map(address => ({
        address,
        isAdmin: false, // Optionally fetch admin status
        totalBorrowed: 0, // Optionally fetch/calculate
        currentlyBorrowed: 0, // Optionally fetch/calculate
        lastActive: new Date(), // Optionally fetch/calculate
      })));
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  const fetchBorrowHistory = async () => {
    try {
      const history = await getBorrowHistory();
      setBorrowHistory(history);
    } catch (error) {
      console.error("Error fetching borrow history:", error);
      toast.error("Failed to fetch borrow history");
    }
  };

  const handleAddBook = async (bookData: Omit<Book, 'id' | 'available' | 'borrower'>) => {
    try {
      await addBook({
        ...bookData,
        available: true
      });
      toast.success("Book added successfully");
      await fetchBooks();
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("Failed to add book");
      throw error;
    }
  };

  const handleEditBook = async (id: string, bookData: Partial<Book>) => {
    try {
      await updateBook(id, bookData);
      toast.success("Book updated successfully");
      await fetchBooks();
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Failed to update book");
      throw error;
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      await deleteBook(id);
      toast.success("Book deleted successfully");
      await fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book");
      throw error;
    }
  };

  const handleAddUser = async (address: string, isAdmin: boolean) => {
    // Decentralized: Implement user addition via smart contract or decentralized identity
    // Placeholder: Remove mock logic, ensure only decentralized logic is used
    return Promise.reject("User management must be implemented via decentralized service");
  };

  const handleToggleAdmin = async (address: string) => {
    // Decentralized: Implement admin toggle via smart contract
    // Placeholder: Remove mock logic, ensure only decentralized logic is used
    return Promise.reject("Admin toggle must be implemented via decentralized service");
  };

  if (!connected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-library-text mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-library-muted">
            Please connect your wallet to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  if (admin === false) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-library-text mb-4">
            Access Denied
          </h2>
          <p className="text-library-muted">
            You do not have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  if (admin === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-library-text mb-4">
            Checking admin status...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-library-text mb-8">Admin Panel</h1>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="books">Book Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="borrow-history">Borrow History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <AdminDashboard 
            books={books}
            borrowHistory={borrowHistory}
            users={users.map(u => u.address)}
            isLoading={loading}
          />
        </TabsContent>

        <TabsContent value="books">
          <BookManagement
            books={books}
            isLoading={loading}
            onAddBook={handleAddBook}
            onEditBook={handleEditBook}
            onDeleteBook={handleDeleteBook}
          />
        </TabsContent>
        
        <TabsContent value="users">
          <UserManagement 
            users={users}
            isLoading={loading}
            onAddUser={handleAddUser}
          />
        </TabsContent>
        
        <TabsContent value="borrow-history">
          <BorrowHistoryView 
            borrowHistory={borrowHistory}
            isLoading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
