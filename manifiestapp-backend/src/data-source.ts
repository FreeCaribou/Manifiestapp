import { DataSource, DataSourceOptions } from "typeorm";
import { Admin } from "./api/admins/admin.entity";
import { Department } from "./api/departments/department.entity";
import { Seller } from "./api/sellers/seller.entity";
import { Address } from "./api/tickets/address.entity";
import { SellingInformation } from "./api/tickets/selling-information.entity";
import { LongText } from "./api/admins/long-text.entity";

export function appDataSourceConfig(): DataSourceOptions {
  return {
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: +process.env.DATABASE_PORT || 3306,
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.NODE_ENV === 'prod' ?
      process.env.DATABASE_NAME :
      process.env.DATABASE_NAME_TEST,
    entities: [Seller, Department, Address, SellingInformation, Admin, LongText],
    logging: true,
    synchronize: true,
  }
}

export function appDataSource(): DataSource {
  return new DataSource(appDataSourceConfig());
}
