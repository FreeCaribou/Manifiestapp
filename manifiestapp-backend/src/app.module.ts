import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RenderingModule } from './rendering/rendering.module';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { appDataSourceConfig } from './data-source';
import { SellersModule } from './api/sellers/sellers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      // ignoreEnvFile: true,
      // load: [appConfig],
    }),
    TypeOrmModule.forRoot({
      ...appDataSourceConfig()
    }),
    HttpModule,
    ApiModule,
    SellersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
