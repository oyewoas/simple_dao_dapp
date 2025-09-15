
# Simple DAO Dapp

Simple DAO is a modern, responsive decentralized governance application built with React, TypeScript, Vite, and Tailwind CSS. It allows users to interact with DAO smart contracts, create and vote on proposals, and view live on-chain events with a beautiful UI.

## Features

- Connect your Ethereum wallet (MetaMask, WalletConnect, etc.)
- Create and vote on proposals
- View all proposals and their statuses
- See live DAO events and transaction feedback (toast notifications)
- Elegant, responsive UI with Tailwind CSS

## Technologies Used

- React & TypeScript
- Vite
- Tailwind CSS
- Viem (for blockchain interactions)
- Wagmi (for wallet and contract hooks)
- react-hot-toast (for notifications)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser at [http://localhost:5173](http://localhost:5173)
4. Connect your wallet and start using Simple DAO!

## Folder Structure

- `src/components/` — UI components (Dashboard, ProposalList, CreateProposal, VoteProposal, DaoEvents, Header)
- `src/contracts/` — Contract ABIs and addresses
- `src/utils/` — Utility functions
- `src/providers/` — Context providers for status and DAO actions

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and new features.

## License

MIT
