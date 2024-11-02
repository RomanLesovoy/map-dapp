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

4. Create environment files:

### .env
```env
PORT=3000
ORIGIN=http://localhost:4200
AUTH_SERVICE_URL=auth-service:5000
BLOCKS_SERVICE_URL=blocks-service:5001
```

### auth-service/.env
```env
AUTH_SERVICE_URL={auth_service_url}
JWT_SECRET={jwt_secret}
```

### blocks-service/.env
```env
CONTRACT_ADDRESS={contract_address}
ETHEREUM_PROVIDER_URL={ethereum_provider_url}
PRIVATE_KEY={private_key}
BLOCKS_SERVICE_URL={blocks_service_url}
REDIS_HOST={redis_host}
REDIS_PORT={redis_port}
```

5. Start the services:

```
npm run start
cd apps/auth-service && npm run start
cd apps/blocks-service && npm run start
```
