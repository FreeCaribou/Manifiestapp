import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom, map } from 'rxjs';
import { Repository } from 'typeorm';
import { ConnectSellerDto } from './dto/connect-seller.dto';
import { CreateSellerDto } from './dto/create-seller.dto';
import { Seller } from './seller.entity';
import * as XLSX from 'xlsx';
import { HttpService } from '@nestjs/axios';
import { env } from 'process';

@Injectable()
export class SellersService {

  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
    private httpService: HttpService
  ) { }

  findAll(): Promise<Seller[]> {
    return this.sellerRepository.find({
      relations: ['department']
    });
  }

  // TODO we will have something better than an ID later to find
  findOne(id: string): Promise<Seller> {
    return this.sellerRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['department']
    });
  }

  createOne(createSeller: CreateSellerDto) {
    return this.sellerRepository.save(this.sellerRepository.create(createSeller));
  }

  async getBeepleExcelData() {
    const path = env.BEEPLE_EXCEL_URL;
    // const data = await (await fetch(path)).arrayBuffer();
    return firstValueFrom(this.httpService.get<any>(path, { responseType: "arraybuffer" })
      .pipe(
        map(d => { return d.data }),
        map(d => {
          const readFile = XLSX.read(d);
          return XLSX.utils.sheet_to_json(readFile.Sheets['COLLABORATORS']);
        })
      ));
    // const readFile = XLSX.read(data);
    // return XLSX.utils.sheet_to_json(readFile.Sheets['COLLABORATORS']);
  }

  async connectBeeple(connectSeller: ConnectSellerDto) {
    const beepleUser = (await firstValueFrom(this.httpService.post<any>(
      'https://volunteers.manifiesta.be/api/v1/authenticate',
      {
        session: {
          email: connectSeller.email,
          password: connectSeller.password,
          display: 'Example API',
        }
      }
    ).pipe(
      map(d => { return d.data }),
    )));

    if (!beepleUser.result) {
      // Beeple API say that the user dont exist
      throw new HttpException({ message: ['error user not existing or bad password'], code: 'auth-bad-combination' }, HttpStatus.NOT_FOUND);
    }

    return {
      email: beepleUser.email,
      id: beepleUser.collaborator_id,
      name: beepleUser.name,
      token: beepleUser.token,
    };
  }

  async getAllShifsByUserId(id) {
    const token = (await this.connectBeeple({ email: env.BEEPLE_ADMIN_MAIL, password: env.BEEPLE_ADMIN_PASSWORD, department: null })).token;
    return this.httpService.get<any>(`https://volunteers.manifiesta.be/api/v1/admin/collaborators/${id}/enrolments`, { headers: { Token: token } }).pipe(
      map(d => {
        return d.data;
      })
    );
  }

  async getOneShiftId(id) {
    const token = (await this.connectBeeple({ email: env.BEEPLE_ADMIN_MAIL, password: env.BEEPLE_ADMIN_PASSWORD, department: null })).token;
    return this.httpService.get<any>(`https://volunteers.manifiesta.be/api/v1/admin/collaborators/enrolments/${id}`, { headers: { Token: token } }).pipe(
      map(d => {
        return d.data;
      })
    );
  }

}
