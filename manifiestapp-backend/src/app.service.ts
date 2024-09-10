import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class AppService {

  constructor(private httpService: HttpService) {}

  getHello() {
    return {version: '0.0.1', name: 'manifiesta-tickets'};
  }

  async bypassCors(url: string) {
    return this.httpService.get(url).pipe(map(d => d.data));
  }
}
