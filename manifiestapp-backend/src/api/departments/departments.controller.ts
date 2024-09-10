import { Controller, Get, Param } from '@nestjs/common';
import { DepartmentsService } from './departments.service';

@Controller('api/departments')
export class DepartmentsController {

  constructor(private readonly departmentsService: DepartmentsService) { }
  
  @Get('/:lang')
  findAll(@Param('lang') lang: string = 'nl') {
    return this.departmentsService.findAll(lang);
  }

  @Get('/info/province')
  getAllProvince() {
    return this.departmentsService.getAllProvince();
  }

}
