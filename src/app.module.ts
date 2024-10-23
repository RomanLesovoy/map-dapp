import { Module } from '@nestjs/common';
import { BlocksModule } from './blocks/blocks.module';

@Module({
  imports: [BlocksModule],
})
export class AppModule {}
