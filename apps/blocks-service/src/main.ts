import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { BlocksModule } from './blocks.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('BlocksService');

  const app = await NestFactory.createMicroservice(BlocksModule, {
    transport: Transport.GRPC,
    options: {
      url: process.env.BLOCKS_SERVICE_URL || 'localhost:5001',
      package: 'blocks',
      protoPath: join(__dirname, '../../../proto/blocks.proto'),
    },
  });

  await app.listen();
  logger.log('Blocks microservice is listening');
}
bootstrap();
