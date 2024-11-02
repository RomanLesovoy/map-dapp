# Map DApp Backend

This project is a backend service for Map DApp, a decentralized application for managing blocks on a map using Ethereum smart contracts.

## Description

Map DApp Backend is a NestJS-based service that facilitates interaction between the frontend application and the Ethereum smart contract. It provides an API for performing operations on map blocks, such as buying, selling, and changing block colors.

root # API Gateway (main application)
├── auth-service/ # Auth microservice
└── blocks-service/ # Blocks microservice

## Technologies

- NestJS
- TypeScript
- ethers.js
- gRPC

## Installation

There are two ways to install and run the application:

1. [Direct Installation](direct-install.md)
   - Traditional method
   - Good for development
   - Requires Node.js and Redis installed locally
   - More control over each service

2. [Docker Installation](docker-install.md) (recommended)
   - Containerized deployment
   - Easy to set up
   - Consistent environment
   - Better for production
   - Includes Redis container

## API Endpoints

### Authentication

- `POST /auth`: Authenticate a user
  - Body: `{ address: string, timestamp: number, signature: string }`
- `POST /auth/verify`: Verify a JWT token
  - Body: `{ token: string }`

### Blocks

All block endpoints require authentication (AuthGuard).

- `GET /blocks/:id`: Get information about a specific block
  - Params: `id` (number)

- `GET /blocks`: Get information about a range of blocks
  - Query params: `startId` (number), `endId` (number)

- `POST /blocks/:id/color`: Set the color of a block
  - Params: `id` (number)
  - Body: `{ color: number }`

- `POST /blocks/:id/color-transaction`: Prepare transaction data for setting block color
  - Params: `id` (number)
  - Body: `{ color: number }`

- `POST /blocks/:id/price`: Set the price of a block
  - Params: `id` (number)
  - Body: `{ price: string }`

- `POST /blocks/:id/price-transaction`: Prepare transaction data for setting block price
  - Params: `id` (number)
  - Body: `{ price: string }`

- `POST /blocks/:id/buy`: Buy a block
  - Params: `id` (number)

- `GET /blocks/:txHash/logs`: Get transaction logs
  - Params: `txHash` (string)

- `POST /blocks/:id/cache`: Update cache for a specific block
  - Params: `id` (number)

- `POST /blocks/:id/buy-transaction`: Prepare transaction data for buying a block
  - Params: `id` (number)

## Smart Contract Interaction

The project uses `BlockchainService` to interact with the smart contract. Make sure you have a local Hardhat node running or have set up a connection to an Ethereum test network.

Smart contract repository: https://github.com/RomanLesovoy/map-dapp-contract

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.