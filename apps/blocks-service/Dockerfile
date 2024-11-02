FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY proto/ ./proto/
COPY tsconfig.json nest-cli.json ./

RUN npm install

COPY src/ ./src/

RUN npm run build

EXPOSE 5001

CMD ["npm", "start"]