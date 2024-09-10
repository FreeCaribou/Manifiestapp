import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConnectSellerDto } from './dto/connect-seller.dto';
import { TicketSaleDto } from './dto/ticket-sale.dto';
import { SellersService } from './sellers.service';

@Controller('api/sellers')
export class SellersController {

  constructor(private readonly sellersService: SellersService) { }
  
  @Get()
  findAll() {
    return this.sellersService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.sellersService.findOne(id);
  }

  @Post('/connect')
  connect(@Body() connectSeller: ConnectSellerDto) {
    return this.sellersService.connectBeeple(connectSeller);
  }

  @Get('/user-shifts/:id')
  getAllShifsByUserId(@Param('id') id: string) {
    return this.sellersService.getAllShifsByUserId(id);
  }

  @Get('/shift/:id')
  getOneShiftId(@Param('id') id: string) {
    return this.sellersService.getOneShiftId(id);
  }

}
