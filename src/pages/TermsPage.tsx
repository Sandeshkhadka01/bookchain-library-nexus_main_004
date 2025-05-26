import React from 'react';

const TermsPage: React.FC = () => (
  <div className="max-w-3xl mx-auto py-12 px-4 animate-fade-in">
    <h1 className="text-3xl font-bold mb-6 text-library-text">Terms and Conditions</h1>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
      <p className="text-library-muted">By using DecentraLib, you agree to these Terms and Conditions. If you do not agree, please do not use the application.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">2. User Responsibilities</h2>
      <p className="text-library-muted">You are responsible for your actions on the platform, including the security of your wallet and compliance with all applicable laws.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">3. Intellectual Property</h2>
      <p className="text-library-muted">All content, trademarks, and data on DecentraLib are the property of their respective owners. Unauthorized use is prohibited.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">4. Disclaimers</h2>
      <p className="text-library-muted">DecentraLib is provided "as is" without warranties of any kind. Use at your own risk. We are not responsible for any loss or damages arising from the use of this platform.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">5. Contact</h2>
      <p className="text-library-muted">For questions about these terms, contact the project maintainers via the repository or provided contact information.</p>
    </section>
  </div>
);

export default TermsPage; 