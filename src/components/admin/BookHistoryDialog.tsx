import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Book, BorrowHistory } from '@/types/book';
import { BlockchainService } from '@/services/mockBlockchain';

interface BookHistoryDialogProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

const BookHistoryDialog: React.FC<BookHistoryDialogProps> = ({
  book,
  isOpen,
  onClose
}) => {
  const [history, setHistory] = useState<BorrowHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      try {
        const allHistory = await BlockchainService.getBorrowHistory();
        const bookHistory = allHistory.filter(record => record.bookId === book.id);
        setHistory(bookHistory);
      } catch (error) {
        console.error('Error fetching book history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [book.id, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Borrowing History - {book.title}</DialogTitle>
          <DialogDescription>
            Complete history of all borrowing transactions for this book.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-library-primary">Loading history...</div>
          </div>
        ) : history.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Borrow Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Transaction Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((record, index) => (
                  <TableRow key={index}>
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
          <div className="text-center py-8">
            <p className="text-library-muted">No borrowing history found for this book.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookHistoryDialog; 