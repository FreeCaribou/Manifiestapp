import { Controller, Get, Render, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { SellersService } from 'src/api/sellers/sellers.service';

@Controller()
export class IndexController {

  constructor(private readonly sellersService: SellersService) {}

  @Get()
  @Render('index')
  async root() {
    const d = await this.sellersService.findAll();
    return { message: 'world template engine !', sellers: d };
  }

  @Post()
  @Render('index')
  async postNew(@Req() req: Request) {
    await this.sellersService.createOne(req.body);
    const d = await this.sellersService.findAll();
    return { message: 'world template engine !', sellers: d };
  }

}
