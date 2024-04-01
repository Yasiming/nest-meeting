import { Module } from '@nestjs/common';
import { CompressController } from './compress.controller';

@Module({
  controllers: [CompressController],
  providers: [],
})
export class CompressModule {}
