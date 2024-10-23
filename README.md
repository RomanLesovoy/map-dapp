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

- `GET /blocks/:id/owner` - Get the owner of a block
- `POST /blocks/:id/buy` - Buy a block
- `POST /blocks/:id/sell` - Put a block up for sale
- `POST /blocks/:id/color` - Change the color of a block
- `GET /blocks/:id/color` - Get the color of a block

## Smart Contract Interaction

The project uses `BlockchainService` to interact with the smart contract. Make sure you have a local Hardhat node running or have set up a connection to an Ethereum test network.

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