# Docker Installation Guide

## Prerequisites
- Docker installed
- Docker Compose installed
- Environment files configured

## Quick Start

1. Create environment files for each service:

```bash
# Copy example env files
cp gateway/.env.example gateway/.env
cp auth-service/.env.example auth-service/.env
cp blocks-service/.env.example blocks-service/.env
```

2. Run with Docker Compose (recommended):
```bash
docker-compose up -d
```

## Manual Installation

If you need to run services separately:

```bash
# Redis
docker run -d --name redis -p 6379:6379 redis:alpine

# Auth Service
docker run -d --name auth-service \
  --env-file ./auth-service/.env \
  map-dapp-auth

# Blocks Service
docker run -d --name blocks-service \
  --env-file ./blocks-service/.env \
  --link redis:redis \
  map-dapp-blocks

# Gateway
docker run -d --name gateway \
  -p 3000:3000 \
  --env-file ./gateway/.env \
  --link auth-service:auth-service \
  --link blocks-service:blocks-service \
  map-dapp-gateway
```

## Environment Files Structure

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
BLOCKS_SERVICE_URL={blocks_service_url}
REDIS_HOST={redis_host}
REDIS_PORT={redis_port}
```

## Troubleshooting

1. Check container logs:
```bash
docker logs gateway
docker logs auth-service
docker logs blocks-service
```

2. Check container network:
```bash
docker network inspect bridge
```

3. Check environment variables:
```bash
docker exec gateway printenv
docker exec auth-service printenv
docker exec blocks-service printenv
```