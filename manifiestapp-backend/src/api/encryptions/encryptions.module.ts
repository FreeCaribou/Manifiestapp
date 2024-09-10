import { Module } from '@nestjs/common';
import { EncryptionsService } from './encryptions.service';

@Module({
  providers: [EncryptionsService],
  exports: [EncryptionsService],
})
export class EncryptionsModule {}
