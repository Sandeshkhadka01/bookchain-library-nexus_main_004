import React from 'react';

const PrivacyPage: React.FC = () => (
  <div className="max-w-3xl mx-auto py-12 px-4 animate-fade-in">
    <h1 className="text-3xl font-bold mb-6 text-library-text">Privacy Policy</h1>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">1. Data Collection</h2>
      <p className="text-library-muted">DecentraLib does not collect personal data beyond what is necessary for blockchain transactions and user authentication via wallet connection.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">2. Use of Information</h2>
      <p className="text-library-muted">Information such as wallet addresses is used solely for providing access to the platform and recording transactions on the blockchain.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">3. Third-Party Services</h2>
      <p className="text-library-muted">We may use third-party services (e.g., IPFS, blockchain networks) which have their own privacy policies. We are not responsible for their practices.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">4. User Rights</h2>
      <p className="text-library-muted">Users can disconnect their wallet at any time. No personal data is stored by DecentraLib outside of the blockchain.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">5. Contact</h2>
      <p className="text-library-muted">For privacy-related questions, contact the project maintainers via the repository or provided contact information.</p>
    </section>
  </div>
);

export default PrivacyPage; 