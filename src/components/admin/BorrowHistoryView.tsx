import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { BorrowHistory } from '@/types/book';

interface BorrowHistoryViewProps {
  borrowHistory: BorrowHistory[];
  isLoading: boolean;
}

const BorrowHistoryView: React.FC<BorrowHistoryViewProps> = ({
  borrowHistory,
  isLoading
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter history based on search term
  const filteredHistory = borrowHistory.filter(record =>
    record.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.borrower.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.transactionHash.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Borrowing History</CardTitle>
          <CardDescription>
            Complete history of all book borrowing transactions on the blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by book title, borrower address, or transaction hash..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-library-primary">Loading history...</div>
            </div>
          ) : filteredHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Borrow Date</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Transaction Hash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.bookTitle}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {record.borrower.slice(0, 6)}...{record.borrower.slice(-4)}
                      </TableCell>
                      <TableCell>
                        {new Date(record.borrowDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {record.returnDate 
                          ? new Date(record.returnDate).toLocaleDateString() 
                          : "Not returned"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {record.transactionHash.slice(0, 6)}...{record.transactionHash.slice(-4)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-library-muted">No borrowing history found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BorrowHistoryView; 