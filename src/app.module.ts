import { Module } from '@nestjs/common';
import { BlocksModule } from './blocks/blocks.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [BlocksModule, AuthModule],
})
export class AppModule {}
