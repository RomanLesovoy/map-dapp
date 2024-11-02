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

1. Clone the repository:
   ```
   git clone https://github.com/your-username/map-dapp-backend.git
   ```

2. Navigate to the project directory:
   ```
   cd map-dapp-backend
   ```

3. Install dependencies:
   ```
   npm install
   cd apps/auth-service && npm install
   cd apps/blocks-service && npm install
   ```

4. Create a `.env` file in the root directory of the project and in each microservice directory and add the following environment variables:
   ```
    CONTRACT_ADDRESS={contract_address}
    ORIGIN={origin}
    PORT=3000
    ETHEREUM_PROVIDER_URL={ethereum_provider_url}
    JWT_SECRET={jwt_secret}
    PRIVATE_KEY={private_key}
    AUTH_SERVICE_URL={auth_service_url}
    BLOCKS_SERVICE_URL={blocks_service_url}
    REDIS_HOST={redis_host}
    REDIS_PORT={redis_port}
   ```

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