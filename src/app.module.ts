import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthController } from './controllers/auth.controller';
import { BlocksController } from './controllers/blocks.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: process.env.AUTH_SERVICE_URL || 'localhost:5000',
          package: 'auth',
          protoPath: join(__dirname, '../proto/auth.proto'),
        },
      },
      {
        name: 'BLOCKS_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: process.env.BLOCKS_SERVICE_URL || 'localhost:5001',
          package: 'blocks',
          protoPath: join(__dirname, '../proto/blocks.proto'),
        },
      },
    ]),
  ],
  controllers: [AuthController, BlocksController, AppController],
  providers: [AppService],
})
export class AppModule {}
