import { ethers } from "ethers";
// Replace with your contract ABI and address
import contractABI from "../contracts/BookLibraryABI.json";
const CONTRACT_ADDRESS = import.meta.env.VITE_LIBRARY_CONTRACT_ADDRESS || "";

let provider: ethers.BrowserProvider | null = null;
let signer: ethers.Signer | null = null;
let contract: ethers.Contract | null = null;

export const connectBlockchain = async () => {
  if (!window.ethereum) throw new Error("MetaMask not detected");
  // Explicitly cast window.ethereum to match the expected type
  provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
};

export const getBooks = async () => {
  if (!contract) await connectBlockchain();
  const books = await contract!.getBooks();
  let skippedBooks = 0;
  let metadataErrors = 0;
  // Fetch and merge metadata from IPFS for each book
  const booksWithMetadata = await Promise.all(
    books.map(async (book: any) => {
      let metadata: any = {};
      let metadataError = false;
      try {
        if (book.metadataURI) {
          const res = await fetch(book.metadataURI);
          metadata = await res.json();
        }
      } catch (e) {
        metadataError = true;
        metadataErrors++;
        console.warn('Failed to fetch metadata for book', book.id, book.metadataURI, e);
      }
      // Fallbacks for required fields
      const merged = {
        ...book,
        ...metadata,
        id: book.id?.toString() ?? metadata.id ?? '',
        title: metadata.title ?? book.title ?? 'Untitled',
        author: metadata.author ?? book.author ?? 'Unknown',
        coverImage: metadata.coverImage ?? book.coverImage ?? '',
        description: metadata.description ?? book.description ?? '',
        isbn: metadata.isbn ?? book.isbn ?? '',
        genre: metadata.genre ?? book.genre ?? '',
        quantity: Number(book.quantity ?? metadata.quantity ?? 0),
        availableCopies: Number(
          book.available ?? 
          metadata.availableCopies ?? 
          book.quantity ?? 
          metadata.quantity ?? 
          0
        ),
        borrowers: book.borrowers ?? [],
        metadataUrl: book.metadataURI ?? metadata.metadataUrl ?? '',
      };
      // Warn if required fields are missing
      if (!merged.id || !merged.title || !merged.coverImage) {
        skippedBooks++;
        console.warn('Book missing required fields after merging metadata:', merged);
        return null;
      }
      if (metadataError) {
        // Mark book as having metadata error (optional)
        merged.metadataError = true;
      }
      return merged;
    })
  );
  // Filter out nulls (skipped books)
  const validBooks = booksWithMetadata.filter(Boolean);
  return { books: validBooks, skippedBooks, metadataErrors };
};

export const getBook = async (id: string) => {
  if (!contract) await connectBlockchain();
  let book: any = {};
  let metadata: any = {};
  try {
    book = await contract!.getBook(Number(id));
  } catch (e) {
    // handle error
  }
  try {
    const uri = book.metadataURI || book[1];
    if (uri) {
      const res = await fetch(uri);
      metadata = await res.json();
    }
  } catch (e) {
    // handle error
  }
  // Normalize tuple to object with named fields and all required Book fields
  const normalizedBook = {
    ...(book || {}),
    ...(metadata || {}),
    id: (book && book.id?.toString()) || (metadata && metadata.id) || '',
    title: (metadata && metadata.title) || (book && book.title) || 'Untitled',
    author: (metadata && metadata.author) || (book && book.author) || 'Unknown',
    coverImage: (metadata && metadata.coverImage) || (book && book.coverImage) || '',
    description: (metadata && metadata.description) || (book && book.description) || '',
    isbn: (metadata && metadata.isbn) || (book && book.isbn) || '',
    genre: (metadata && metadata.genre) || (book && book.genre) || '',
    quantity: Number((book && book.quantity) || (metadata && metadata.quantity) || 0),
    availableCopies: Number((book && book.available) || (metadata && metadata.availableCopies) || 0),
    borrowers: (book && book.borrowers) || [],
    metadataUrl: (book && book.metadataURI) || (metadata && metadata.metadataUrl) || '',
  };
  return normalizedBook;
};

export const borrowBook = async (bookId: string) => {
  if (!contract) await connectBlockchain();
  const tx = await contract!.borrowBook(bookId);
  await tx.wait();
  return tx.hash;
};

export const returnBook = async (bookId: string) => {
  if (!contract) await connectBlockchain();
  const tx = await contract!.returnBook(bookId);
  await tx.wait();
  return tx.hash;
};

export const addBook = async (bookData: any) => {
  if (!contract) await connectBlockchain();
  // Use metadataUrl from bookData (already uploaded by pinataService)
  const tx = await contract!.addBook(
    bookData.metadataUrl,
    bookData.quantity
  );
  await tx.wait();
  return tx.hash;
};

export const getBorrowHistory = async () => {
  if (!contract) await connectBlockchain();
  const history = await contract!.getBorrowHistory();
  // Fetch all books for title lookup
  const booksResult = await getBooks();
  const books = booksResult.books;
  return history.map((record: any) => {
    const bookId = record.bookId?.toString?.() || record.bookId?.toString() || String(record.bookId);
    const book = books.find(b => b.id === bookId);
    return {
      bookId,
      bookTitle: book ? book.title : 'Unknown',
      borrower: record.borrower,
      borrowDate: record.timestamp ? new Date(Number(record.timestamp) * 1000) : null,
      returnDate: record.returned ? new Date(Number(record.timestamp) * 1000) : null, // Only if you track return time
      transactionHash: null, // Not available from contract history
      ...record,
    };
  });
};

export const getUserBorrowHistory = async (userAddress: string) => {
  if (!contract) await connectBlockchain();
  const history = await contract!.getUserBorrowHistory(userAddress);
  // Fetch all books for title lookup
  const booksResult = await getBooks();
  const books = booksResult.books;
  return history.map((record: any) => {
    const bookId = record.bookId?.toString?.() || record.bookId?.toString() || String(record.bookId);
    const book = books.find(b => b.id === bookId);
    return {
      bookId,
      bookTitle: book ? book.title : 'Unknown',
      borrowDate: record.timestamp ? new Date(Number(record.timestamp) * 1000) : null,
      returnDate: record.returned ? new Date(Number(record.timestamp) * 1000) : null, // Only if you track return time
      transactionHash: null, // Not available from contract history
      ...record,
    };
  });
};

export const updateBook = async (id: string, bookData: any) => {
  if (!contract) await connectBlockchain();
  // Use metadataUrl from bookData (already uploaded by pinataService)
  const tx = await contract!.updateBook(
    id,
    bookData.metadataUrl,
    bookData.quantity
  );
  await tx.wait();
  return tx.hash;
};

export const deleteBook = async (id: string) => {
  if (!contract) await connectBlockchain();
  const tx = await contract!.deleteBook(id);
  await tx.wait();
  return tx.hash;
};

export const makeAdmin = async (userAddress: string) => {
  if (!contract) await connectBlockchain();
  const tx = await contract!.makeAdmin(userAddress);
  await tx.wait();
  return tx.hash;
};

export const removeAdmin = async (userAddress: string) => {
  if (!contract) await connectBlockchain();
  const tx = await contract!.removeAdmin(userAddress);
  await tx.wait();
  return tx.hash;
};

export const isAdmin = async (userAddress: string) => {
  if (!contract) await connectBlockchain();
  return await contract!.isAdmin(userAddress);
};

export const getSuperAdmin = async () => {
  if (!contract) await connectBlockchain();
  return await contract!.superAdmin();
};

export const register = async () => {
  if (!contract) await connectBlockchain();
  const tx = await contract!.register();
  await tx.wait();
  return tx.hash;
};

export const isUser = async (address: string) => {
  if (!contract) await connectBlockchain();
  return await contract!.isUser(address);
};

export const getAllAdmins = async () => {
  if (!contract) await connectBlockchain();
  return await contract!.getAllAdmins();
};

export const getAllUsers = async () => {
  if (!contract) await connectBlockchain();
  return await contract!.getAllUsers();
};

export const removeUser = async (userAddress: string) => {
  if (!contract) await connectBlockchain();
  const tx = await contract!.removeUser(userAddress);
  await tx.wait();
  return tx.hash;
};

export const addUser = async (userAddress: string) => {
  if (!contract) await connectBlockchain();
  const tx = await contract!.addUser(userAddress);
  await tx.wait();
  return tx.hash;
};