# Map DApp Backend

This project is a backend service for Map DApp, a decentralized application for managing blocks on a map using Ethereum smart contracts.

## Description

Map DApp Backend is a NestJS-based service that facilitates interaction between the frontend application and the Ethereum smart contract. It provides an API for performing operations on map blocks, such as buying, selling, and changing block colors.

## Technologies

- NestJS
- TypeScript
- ethers.js
- Hardhat (for local development and testing)

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
   ```

4. Create a `.env` file in the root directory of the project and add the following environment variables:
   ```
   CONTRACT_ADDRESS=your_contract_address
   ```

## Running the app

To run the server in development mode:

```
npm run start:dev
```

## Testing

To run the tests:

```
npm run test
```

## API Endpoints

The Block Trading API provides the following endpoints:

### Get All Blocks Info
- **GET** `/blocks`
- **Query Parameters**: 
  - `startId`: number (starting block ID)
  - `endId`: number (ending block ID)
- **Description**: Returns information about blocks in the specified range.
- **Response**: Array of BlockInfo objects

### Get Single Block Info
- **GET** `/blocks/:id`
- **Parameters**: 
  - `id`: number (block ID)
- **Description**: Returns information about a specific block.
- **Response**: BlockInfo object

### Buy Block
- **POST** `/blocks/:id/buy`
- **Parameters**: 
  - `id`: number (block ID)
- **Body**: 
  - `buyer`: string (Ethereum address of the buyer)
- **Description**: Purchases a block.
- **Response**: Boolean indicating success

### Sell Block
- **POST** `/blocks/:id/sell`
- **Parameters**: 
  - `id`: number (block ID)
- **Body**: 
  - `seller`: string (Ethereum address of the seller)
  - `price`: string (price in ETH)
- **Description**: Lists a block for sale.
- **Response**: Boolean indicating success

### Buy Block From User
- **POST** `/blocks/:id/buy-from-user`
- **Parameters**: 
  - `id`: number (block ID)
- **Body**: 
  - `buyer`: string (Ethereum address of the buyer)
- **Description**: Purchases a block that is listed for sale by another user.
- **Response**: Boolean indicating success

### Set Block Color
- **POST** `/blocks/:id/color`
- **Parameters**: 
  - `id`: number (block ID)
- **Body**: 
  - `color`: number (color code)
  - `owner`: string (Ethereum address of the block owner)
- **Description**: Sets the color of a block.
- **Response**: Boolean indicating success

### Buy Multiple Blocks
- **POST** `/blocks/buy-multiple`
- **Body**: 
  - `blockIds`: number[] (array of block IDs to purchase)
  - `buyer`: string (Ethereum address of the buyer)
- **Description**: Purchases multiple blocks in a single transaction.
- **Response**: Boolean indicating success

## BlockInfo Object

The BlockInfo object contains the following properties:

- `owned`: boolean (indicates if the block is owned)
- `owner`: string (Ethereum address of the owner)
- `color`: number (color code of the block)
- `price`: string (price of the block in ETH)

## Smart Contract Interaction

The project uses `BlockchainService` to interact with the smart contract. Make sure you have a local Hardhat node running or have set up a connection to an Ethereum test network.

Smart contract repository: https://github.com/RomanLesovoy/map-dapp-contract

## Development

1. Ensure you have a local Hardhat node running:
   ```
   npx hardhat node
   ```

2. Deploy the smart contract to the local Hardhat network and update the `CONTRACT_ADDRESS` in the `.env` file.

3. Run the server in development mode:
   ```
   npm run start:dev
   ```

## Contributing

Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.