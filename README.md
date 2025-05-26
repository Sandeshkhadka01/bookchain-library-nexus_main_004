# DecentraLib 📚⛓️

A modern, decentralized library management system leveraging blockchain and IPFS for secure, transparent, and user-friendly book borrowing and management.

---

## 📝 Introduction

**DecentraLib** is a decentralized application (dApp) that transforms traditional library management by using blockchain technology for transparent, tamper-proof records and IPFS for decentralized storage of book metadata and images. Users can browse, borrow, and return books, while admins manage the library catalog—all through a beautiful, responsive web interface.

---

## 🚀 Features

- Decentralized book borrowing and returning (blockchain-backed)
- Immutable borrowing history and transparent records
- Modern, responsive UI (React + shadcn-ui + Tailwind CSS)
- Decentralized storage of book metadata and covers (IPFS)
- Web3 wallet authentication (MetaMask)
- Role-based access: Super Admin, Admin, User
- Real-time feedback (toasts, loaders)
- Comprehensive admin panel for book and user management
- Error boundaries and robust error handling

---

## 🎯 Aims and Objectives

- **Aim:** To provide a secure, transparent, and user-friendly decentralized library system.
- **Objectives:**
  - Enable users to borrow/return books with blockchain-backed records
  - Allow admins to manage books and users securely
  - Store book metadata and images on IPFS for persistence and censorship resistance
  - Ensure all actions are transparent and auditable

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, shadcn-ui, Tailwind CSS
- **Blockchain:** Solidity (Ethereum-compatible), ethers.js
- **Smart Contract Development:** Hardhat
- **Storage:** IPFS (for book metadata and images)
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **State/Data:** React Context, TanStack Query
- **Form/Validation:** React Hook Form, Zod
- **Other:** ESLint, Docker, Netlify/Vercel configs

---

## ⚙️ Smart Contract Development

This project uses [Hardhat](https://hardhat.org/) for compiling, testing, and deploying smart contracts.

- Contract source: `contracts/BookLibrary.sol`
- Hardhat config: `hardhat.config.cjs`

### Common Hardhat Commands

```bash
# Install Hardhat (if not already installed)
npm install --save-dev hardhat

# Compile contracts
npx hardhat compile

# Run contract tests
npx hardhat test

# Deploy to a local network
npx hardhat run scripts/deploy.js --network localhost

# Start a local Hardhat node
npx hardhat node

# Deploy to a testnet (example: Goerli)
npx hardhat run scripts/deploy.js --network goerli
```

---

## 📦 Important Commands

Here are the most useful commands for working with DecentraLib:

### Frontend
```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview

# Lint the codebase
npm run lint
```

### Smart Contracts (Hardhat)
```bash
# Compile contracts
npx hardhat compile

# Run contract tests
npx hardhat test

# Start a local blockchain node
npx hardhat node

# Deploy contracts (local/testnet)
npx hardhat run scripts/deploy.js --network <network>
```

---

## 🧑‍💻 User Roles

- **Super Admin:** Full control, can add/remove admins and users
- **Admin:** Can manage books and users
- **User:** Can browse, borrow, and return books

---

## 🔗 How It Works

1. **Connect Wallet:** Users authenticate using MetaMask (or compatible Web3 wallet).
2. **Browse Books:** All users can view the library catalog, with book details loaded from IPFS.
3. **Borrow/Return:** Users borrow or return books via blockchain transactions. The smart contract updates availability and records the action immutably.
4. **Admin Panel:** Admins can add, edit, or delete books, and manage users. All actions are recorded on-chain.
5. **Decentralized Storage:** Book metadata (title, author, cover image, etc.) is stored on IPFS, ensuring data is always accessible and censorship-resistant.

---

## 🏗️ Smart Contract Overview

- Written in Solidity, deployed to an Ethereum-compatible network
- Manages books, users, admins, and borrowing/returning logic
- Emits events for all major actions (add, update, borrow, return, etc.)
- Access control for super admin, admin, and user roles
- Book metadata is referenced by IPFS URIs

---

## 🚦 Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or bun
- MetaMask (browser extension)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd decentraliib
```
2. **Install dependencies:**
```bash
npm install
# or
bun install
```
3. **Configure Environment:**
- Copy `.env.example` to `.env` and set `VITE_LIBRARY_CONTRACT_ADDRESS` to your deployed contract address.

4. **Start the development server:**
```bash
npm run dev
# or
bun run dev
```
- Visit `http://localhost:5173` in your browser.

---

## 📝 How to Use DecentraLib

1. **Connect your wallet** (MetaMask prompt will appear)
2. **Browse books** on the homepage or books page
3. **Borrow a book** (if available) — transaction will be sent to the blockchain
4. **Return a book** you've borrowed
5. **Admins:** Access the admin panel to add/edit/delete books and manage users
6. **All actions** are recorded on-chain and visible in the UI

---

## 🌐 Deployment

### Deploying to GitHub Pages
1. Build the app:
```bash
npm run build
```
2. Deploy the `dist/` folder to the `gh-pages` branch (use the `gh-pages` npm package or GitHub Actions)
3. Set the correct `base` in `vite.config.ts` if your repo is not at the root
4. Your app will be live at `https://<username>.github.io/<repo-name>/`

### Other Platforms
- Vercel, Netlify, AWS S3, Docker, etc. — just serve the static files in `dist/`

---

## 🎨 Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/      # React Context providers
├── hooks/         # Custom React hooks
├── lib/           # Utility libraries and configurations
├── pages/         # Application pages/routes
├── services/      # Blockchain and IPFS integrations
├── types/         # TypeScript type definitions
└── utils/         # Helper functions and utilities
```

---

## ❓ FAQ

**Q: Do I need a backend server?**
A: No! All logic runs in the browser. Blockchain and IPFS are accessed directly from the frontend.

**Q: What network does DecentraLib use?**
A: Any Ethereum-compatible network. Set your contract address in the `.env` file.

**Q: How is book data stored?**
A: Book metadata and images are stored on IPFS. The smart contract stores only the IPFS URI and availability info.

**Q: How do I become an admin?**
A: Only the super admin can promote users to admin via the admin panel.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- [shadcn-ui](https://ui.shadcn.com/) for the beautiful component library
- All the amazing open-source libraries and blockchain tools that make this project possible
