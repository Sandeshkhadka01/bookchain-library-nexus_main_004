import React, { useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BookOpen, 
  Users, 
  History, 
  ArrowDown, 
  ArrowUp, 
  Book
} from 'lucide-react';
import { Book as BookType, BorrowHistory } from '@/types/book';
import { calculateActivityStats } from '@/utils/activityStats';

interface AdminDashboardProps {
  books: BookType[];
  borrowHistory: BorrowHistory[];
  users: string[];
  isLoading: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  books, 
  borrowHistory, 
  users,
  isLoading 
}) => {
  
  // Calculate statistics
  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.availableCopies > 0).length;
  const borrowedBooks = books.filter(book => book.availableCopies === 0).length;
  const totalTransactions = borrowHistory.length;
  const activeUsers = users.length;

  // Enhanced library stats
  const totalCopies = books.reduce((sum, b) => sum + (b.quantity || 0), 0);
  const totalAvailableCopies = books.reduce((sum, b) => sum + (b.availableCopies || 0), 0);
  const totalBorrowedCopies = totalCopies - totalAvailableCopies;

  // Improved Active Borrowers logic
  const activeBorrowers = useMemo(() => {
    const borrowers = books
      .filter(b => b.borrowers && b.borrowers.length > 0)
      .flatMap(b => b.borrowers.map(br => br.address));
    return new Set(borrowers).size;
  }, [books]);

  // Calculate activity stats using memoization to prevent unnecessary recalculations
  const activityStats = useMemo(() => 
    calculateActivityStats(borrowHistory, 7), 
    [borrowHistory]
  );

  // Find top borrowed book
  const topBorrowedBook = useMemo(() => {
    if (borrowHistory.length === 0) return "None";
    
    const bookCounts: Record<string, number> = {};
    borrowHistory.forEach(history => {
      bookCounts[history.bookTitle] = (bookCounts[history.bookTitle] || 0) + 1;
    });
    
    return Object.keys(bookCounts).reduce((a, b) => 
      bookCounts[a] > bookCounts[b] ? a : b
    );
  }, [borrowHistory]);

  // New Books Added: use highest 5 IDs as proxy for 'new'
  const newBooksAdded = useMemo(() => {
    const sorted = [...books].sort((a, b) => Number(b.id) - Number(a.id));
    return sorted.slice(0, 5).length;
  }, [books]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse text-library-primary">Loading dashboard data...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardDescription>Library Stats</CardDescription>
                <CardTitle className="text-2xl flex items-center justify-between">
                  {totalBooks}
                  <BookOpen className="h-5 w-5 text-library-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="flex items-center justify-between">
                    Total Copies <span>{totalCopies}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    Available Copies <span>{totalAvailableCopies}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    Borrowed Copies <span>{totalBorrowedCopies}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardDescription>Total Users</CardDescription>
                <CardTitle className="text-2xl flex items-center justify-between">
                  {activeUsers}
                  <Users className="h-5 w-5 text-library-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p className="flex items-center justify-between">
                    Active Borrowers <span>{activeBorrowers}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    Total Transactions <span>{totalTransactions}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardDescription>Recent Activity</CardDescription>
                <CardTitle className="text-2xl flex items-center justify-between">
                  {activityStats.borrows.recent + activityStats.returns.recent} actions
                  <History className="h-5 w-5 text-library-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p className="flex items-center justify-between">
                    <span className="flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                      Borrows
                    </span>
                    <span>{activityStats.borrows.recent}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="flex items-center">
                      <ArrowDown className="h-4 w-4 mr-1 text-amber-500" />
                      Returns
                    </span>
                    <span>{activityStats.returns.recent}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Last updated: {activityStats.lastUpdated.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Books</CardTitle>
                <CardDescription>Most frequently borrowed books</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Book className="h-8 w-8 text-library-primary" />
                  <div>
                    <p className="font-medium">{topBorrowedBook}</p>
                    <p className="text-sm text-muted-foreground">Top borrowed book</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Summary</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New Books Added</span>
                    <span className="font-medium">{newBooksAdded}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Transactions</span>
                    <span className="font-medium">{totalTransactions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Borrowers</span>
                    <span className="font-medium">{activityStats.borrows.active}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
