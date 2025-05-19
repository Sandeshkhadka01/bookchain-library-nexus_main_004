import { Book, BorrowHistory } from '@/types/book';
import { toast } from 'sonner';

// Mock data
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Blockchain Revolution',
    author: 'Don Tapscott & Alex Tapscott',
    description: 'How the technology behind Bitcoin is changing money, business, and the world.',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    isbn: '978-1-234567-89-0',
    genre: 'Technology',
    quantity: 2,
    availableCopies: 1,
    borrowers: [{
      address: '0x1234567890abcdef1234567890abcdef12345678',
      borrowDate: new Date('2023-03-20')
    }]
  },
  {
    id: '2',
    title: 'Decentralized Applications',
    author: 'Siraj Raval',
    description: 'A comprehensive guide to the development of decentralized applications.',
    coverImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    isbn: '978-2-345678-90-1',
    genre: 'Technology',
    quantity: 1,
    availableCopies: 1,
    borrowers: []
  },
  {
    id: '3',
    title: 'Mastering Ethereum',
    author: 'Andreas M. Antonopoulos & Gavin Wood',
    description: 'Building smart contracts and DApps on the Ethereum blockchain.',
    coverImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    isbn: '978-3-456789-01-2',
    genre: 'Technology',
    quantity: 3,
    availableCopies: 2,
    borrowers: []
  },
  {
    id: '4',
    title: 'Token Economy',
    author: 'Shermin Voshmgir',
    description: 'How the Web3 reinvents the Internet.',
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    isbn: '978-4-567890-12-3',
    genre: 'Economics',
    quantity: 1,
    availableCopies: 1,
    borrowers: []
  },
  {
    id: '5',
    title: 'Cryptonomicon',
    author: 'Neal Stephenson',
    description: 'A novel about cryptography, cryptocurrency, and the digital economy.',
    coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    isbn: '978-5-678901-23-4',
    genre: 'Fiction',
    quantity: 2,
    availableCopies: 1,
    borrowers: [{
      address: '0x0987654321fedcba0987654321fedcba09876543',
      borrowDate: new Date('2023-04-10')
    }]
  },
  {
    id: '6',
    title: 'The Internet of Money',
    author: 'Andreas M. Antonopoulos',
    description: 'Exploring the philosophical, social, and historical implications of Bitcoin.',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    isbn: '978-6-789012-34-5',
    genre: 'Economics',
    quantity: 1,
    availableCopies: 1,
    borrowers: []
  },
];

const mockBorrowHistory: BorrowHistory[] = [
  {
    bookId: '3',
    bookTitle: 'Mastering Ethereum',
    borrower: '0x1234567890abcdef1234567890abcdef12345678',
    borrowDate: new Date('2023-05-15'),
    returnDate: new Date('2023-06-15'),
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  {
    bookId: '5',
    bookTitle: 'Cryptonomicon',
    borrower: '0x0987654321fedcba0987654321fedcba09876543',
    borrowDate: new Date('2023-04-10'),
    returnDate: null,
    transactionHash: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  },
  {
    bookId: '1',
    bookTitle: 'The Blockchain Revolution',
    borrower: '0x1234567890abcdef1234567890abcdef12345678',
    borrowDate: new Date('2023-03-20'),
    returnDate: new Date('2023-04-05'),
    transactionHash: '0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210'
  }
];

// Simulate blockchain transaction delay
const simulateTransaction = async () => {
  return new Promise<string>((resolve) => {
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    setTimeout(() => {
      resolve(transactionHash);
    }, 2000);
  });
};

// Mock blockchain service
export const BlockchainService = {
  getBooks: async (): Promise<Book[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [...mockBooks];
  },
  
  getBook: async (id: string): Promise<Book | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const book = mockBooks.find(book => book.id === id);
    return book || null;
  },
  
  borrowBook: async (bookId: string, borrowerAddress: string): Promise<string> => {
    toast.info("Processing transaction...");
    const transactionHash = await simulateTransaction();
    
    const bookIndex = mockBooks.findIndex(book => book.id === bookId);
    if (bookIndex === -1) {
      throw new Error("Book not found");
    }

    const book = mockBooks[bookIndex];
    
    // Check if there are available copies
    if (book.availableCopies <= 0) {
      throw new Error("No copies available for borrowing");
    }

    // Check if user has already borrowed this book
    if (book.borrowers?.some(b => b.address === borrowerAddress)) {
      throw new Error("You already have a copy of this book");
    }
    
    // Update book status
    mockBooks[bookIndex] = {
      ...book,
      availableCopies: book.availableCopies - 1,
      borrowers: [...(book.borrowers || []), {
        address: borrowerAddress,
        borrowDate: new Date()
      }]
    };
    
    // Add to borrow history
    mockBorrowHistory.push({
      bookId,
      bookTitle: book.title,
      borrower: borrowerAddress,
      borrowDate: new Date(),
      returnDate: null,
      transactionHash
    });
    
    toast.success("Book borrowed successfully!");
    return transactionHash;
  },
  
  returnBook: async (bookId: string, borrowerAddress: string): Promise<string> => {
    toast.info("Processing transaction...");
    const transactionHash = await simulateTransaction();
    
    const bookIndex = mockBooks.findIndex(book => book.id === bookId);
    if (bookIndex === -1) {
      throw new Error("Book not found");
    }

    const book = mockBooks[bookIndex];
    
    // Check if user has borrowed this book
    const borrowerIndex = book.borrowers?.findIndex(b => b.address === borrowerAddress);
    if (borrowerIndex === undefined || borrowerIndex === -1) {
      throw new Error("You haven't borrowed this book");
    }
    
    // Update book status
    const updatedBorrowers = [...(book.borrowers || [])];
    updatedBorrowers.splice(borrowerIndex, 1);
    
    mockBooks[bookIndex] = {
      ...book,
      availableCopies: book.availableCopies + 1,
      borrowers: updatedBorrowers
    };
    
    // Update borrow history
    const historyIndex = mockBorrowHistory.findIndex(
      history => history.bookId === bookId && 
                history.borrower === borrowerAddress && 
                !history.returnDate
    );

    if (historyIndex === -1) {
      throw new Error("No active borrow record found");
    }

    mockBorrowHistory[historyIndex] = {
      ...mockBorrowHistory[historyIndex],
      returnDate: new Date()
    };
    
    toast.success("Book returned successfully!");
    return transactionHash;
  },
  
  addBook: async (bookData: Omit<Book, 'id'>): Promise<void> => {
    toast.info("Processing transaction...");
    const transactionHash = await simulateTransaction();
    
    const newBook: Book = {
      ...bookData,
      id: `${Date.now()}`,
      availableCopies: bookData.quantity,
      borrowers: []
    };
    mockBooks.push(newBook);
    
    toast.success("Book added successfully!");
  },
  
  getBorrowHistory: async (): Promise<BorrowHistory[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Sort history by borrow date, most recent first
    return [...mockBorrowHistory].sort(
      (a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
    );
  },
  
  getUserBorrowHistory: async (userAddress: string): Promise<BorrowHistory[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Filter by user and sort by borrow date, most recent first
    return mockBorrowHistory
      .filter(history => history.borrower === userAddress)
      .sort((a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime());
  },

  updateBook: async (id: string, bookData: Partial<Book>): Promise<void> => {
    toast.info("Processing transaction...");
    await simulateTransaction();
    
    const bookIndex = mockBooks.findIndex(book => book.id === id);
    if (bookIndex === -1) {
      throw new Error("Book not found");
    }

    const book = mockBooks[bookIndex];
    
    // Calculate new available copies based on quantity change
    let newAvailableCopies = book.availableCopies;
    if (bookData.quantity !== undefined) {
      const borrowedCopies = book.quantity - book.availableCopies;
      newAvailableCopies = bookData.quantity - borrowedCopies;
      if (newAvailableCopies < 0) {
        throw new Error("Cannot reduce quantity below number of borrowed copies");
      }
    }

    // Update the book
    mockBooks[bookIndex] = {
      ...book,
      ...bookData,
      availableCopies: newAvailableCopies,
      borrowers: book.borrowers // Preserve borrowers data
    };
    
    toast.success("Book updated successfully!");
  },

  deleteBook: async (id: string): Promise<void> => {
    toast.info("Processing transaction...");
    await simulateTransaction();
    
    const bookIndex = mockBooks.findIndex(book => book.id === id);
    if (bookIndex === -1) {
      throw new Error("Book not found");
    }

    const book = mockBooks[bookIndex];

    // Check if all copies are available
    if (book.availableCopies < book.quantity) {
      throw new Error("Cannot delete book while copies are borrowed");
    }

    mockBooks.splice(bookIndex, 1);
    
    // Mark history entries for this book as deleted
    mockBorrowHistory.forEach(history => {
      if (history.bookId === id) {
        history.bookTitle = `[DELETED] ${history.bookTitle}`;
      }
    });

    toast.success("Book deleted successfully!");
  }
};
