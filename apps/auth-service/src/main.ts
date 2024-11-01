import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthModule, {
    transport: Transport.GRPC,
    options: {
      url: process.env.AUTH_SERVICE_URL || 'localhost:5000',
      package: 'auth',
      protoPath: join(__dirname, '../../../proto/auth.proto'),
    },
  });
  await app.listen();
}
bootstrap(); 