import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SellersModule } from 'src/api/sellers/sellers.module';
import { SellersService } from 'src/api/sellers/sellers.service';
import { IndexController } from './index/index.controller';

@Module({
  imports: [HttpModule, SellersModule],
  controllers: [IndexController],
})
export class RenderingModule {}
