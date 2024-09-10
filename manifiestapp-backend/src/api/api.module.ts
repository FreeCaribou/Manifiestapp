import { Module } from '@nestjs/common';
import { SellersModule } from './sellers/sellers.module';
import { DepartmentsModule } from './departments/departments.module';
import { TicketsModule } from './tickets/tickets.module';
import { AdminsModule } from './admins/admins.module';
import { EncryptionsModule } from './encryptions/encryptions.module';

@Module({
  imports: [SellersModule, DepartmentsModule, TicketsModule, AdminsModule, EncryptionsModule]
})
export class ApiModule {}
