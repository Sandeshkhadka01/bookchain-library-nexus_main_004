import React from 'react';

const DocumentationPage: React.FC = () => (
  <div className="max-w-3xl mx-auto py-12 px-4 animate-fade-in">
    <h1 className="text-3xl font-bold mb-6 text-library-text">Documentation</h1>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Introduction</h2>
      <p className="text-library-muted">Welcome to DecentraLib! This documentation will help you get started, use the platform, and understand its features.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
      <p className="text-library-muted">1. Connect your wallet (MetaMask or compatible).<br />2. Browse available books.<br />3. Borrow or return books via blockchain transactions.<br />4. Admins can manage books and users from the admin panel.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">User Guide</h2>
      <p className="text-library-muted">- Browse and search for books.<br />- View book details.<br />- Borrow available books.<br />- Return borrowed books.<br />- View your borrowing history.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Admin Guide</h2>
      <p className="text-library-muted">- Add, edit, or delete books.<br />- Manage users and admin roles.<br />- View overall borrowing statistics and history.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Smart Contract Overview</h2>
      <p className="text-library-muted">DecentraLib uses a Solidity smart contract to manage books, users, and borrowing logic. All actions are recorded on-chain for transparency and security.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Support</h2>
      <p className="text-library-muted">For help, open an issue on the GitHub repository or contact the maintainers.</p>
    </section>
  </div>
);

export default DocumentationPage; 