export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  isbn: string;
  genre: string;
  quantity: number;
  availableCopies: number;  // Track available copies separately
  borrowers?: Array<{      // Track multiple borrowers
    address: string;
    borrowDate: Date;
  }>;
}

export type BookFormData = Omit<Book, 'id' | 'availableCopies' | 'borrowers'>;

export interface BookData {
  title: string;
  author: string;
  description: string;
  coverImage: File | null; // For form submission
  coverImageUrl?: string; // For display
  isbn: string;
  genre: string;
  quantity: number;
}

export interface BorrowHistory {
  bookId: string;
  bookTitle: string;
  borrower: string;
  borrowDate: Date;
  returnDate: Date | null;
  transactionHash: string;
}

export interface ActivityStats {
  timeWindow: {
    start: Date;
    end: Date;
  };
  borrows: {
    total: number;
    active: number;
    recent: number;
  };
  returns: {
    total: number;
    recent: number;
  };
  lastUpdated: Date;
}
