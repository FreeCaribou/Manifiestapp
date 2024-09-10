import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { EncryptionsService } from '../encryptions/encryptions.service';
import { Seller } from '../sellers/seller.entity';
import { departments, provinces } from '../shared/data/departments.list';
import { Address } from '../tickets/address.entity';
import { SellingInformation } from '../tickets/selling-information.entity';
import { Admin } from './admin.entity';
import { LoginDto } from './login.dto';
import { FinishOrderDto } from './dto/finish-order.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, forkJoin, from, map } from 'rxjs';
import { isNumber } from 'class-validator';
import { LongText } from './long-text.entity';
import { EditLongtextDto } from './dto/edit-long-text.dto';
import { FinishOrderTransactionIdDto } from './dto/finish-order-transaction-id.dto';
import { SellersService } from '../sellers/sellers.service';
import { env } from 'process';
import { TicketsService } from '../tickets/tickets.service';
import { EditSellingsInformationDTO } from './dto/edit-sellings-information.dto';

// TODO refactor to avoid dublon with or without by edition
@Injectable()
export class AdminsService {

  jwt = require('jsonwebtoken');

  apiKey = process.env.EVENT_SQUARE_API_KEY;
  posToken = process.env.EVENT_SQUARE_POS_TOKEN;

  vwSecret = process.env.VIVA_WALLET_SMART_CHECKOUT_SECRET;
  vwClient = process.env.VIVA_WALLET_SMART_CHECKOUT_CLIENT_ID;

  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(SellingInformation)
    private readonly sellingInformationRepository: Repository<SellingInformation>,
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
    @InjectRepository(LongText)
    private readonly longtextRepository: Repository<LongText>,
    private readonly encryptionService: EncryptionsService,
    private httpService: HttpService,
    private sellersService: SellersService,
    private ticketsService: TicketsService,
  ) { }

  createUserToken(admin: Admin) {
    return this.jwt.sign({ email: admin.email, id: admin.id, extra: admin.extra }, process.env.JWT_SECURITY_KEY);
  }

  async login(loginDto: LoginDto) {
    const admin = await this.findUserByEmailAdmin(loginDto.email);

    // the user exist?
    if (!admin) {
      throw new HttpException({ message: ['Bad email?'], code: 'login-001' }, HttpStatus.BAD_REQUEST);
    }

    // it is the good password?
    if (!await this.encryptionService.compare(loginDto.password, admin.password)) {
      throw new HttpException({ message: ['Bad password.'], code: 'login-002' }, HttpStatus.BAD_REQUEST);
    }

    const token = await this.createUserToken(admin);

    return { token, email: admin.email, extra: admin.extra };
  }

  findUserByEmailAdmin(email: string) {
    return this.adminRepository.findOne({ where: { email: email } });
  }

  getAllPhysicalTickets() {
    return this.addressRepository.find({ where: { eventsquareReference: Not(IsNull()) } });
  }

  private getNumberOfTicket(data: any[]): number {
    let totalAmountTicket = 0;
    data.forEach(t => {
      totalAmountTicket += t.quantity || 0;
    });
    return totalAmountTicket;
  }

  async physicalTicketSendDone(id) {
    const address = await this.addressRepository.findOneBy({ id });
    address.sendDone = !address.sendDone;
    return this.addressRepository.save(address);
  }

  async getAllSellingsInformation() {
    const data = await this.sellingInformationRepository.find();
    return {
      data: data.filter(d => {
        return !this.ticketsService.presenceOfTestTicket(d);
      }),
      totalAmountTicket: this.getNumberOfTicket(data)
    };
  }

  async getAllSellingsInformationByEdition(edition: string) {
    const data = await this.sellingInformationRepository.find({ where: { edition } });
    return {
      data: data.filter(d => {
        return !this.ticketsService.presenceOfTestTicket(d);
      }),
      totalAmountTicket: this.getNumberOfTicket(data)
    };
  }

  async getAllSellersSellingsInformation(): Promise<{ data: any[], totalAmountTicket: number }> {
    const data = await this.sellingInformationRepository.find({
      where: { eventsquareReference: Not(IsNull()) },
      order: { sellerId: 'ASC' },
    });

    const dataGroupBySellerId = [];

    data.filter(d => {
      return !this.ticketsService.presenceOfTestTicket(d);
    }).forEach(d => {
      const index = dataGroupBySellerId.findIndex(x => x.sellerId === d.sellerId);
      if (index > -1) {
        dataGroupBySellerId[index].quantity += d.quantity;
        dataGroupBySellerId[index].details.push(d);
      } else {
        dataGroupBySellerId.push({
          sellerId: d.sellerId,
          quantity: d.quantity,
          details: [d],
        });
      }
    });

    for (let i = 0; i < dataGroupBySellerId.length; i++) {
      const u = await this.sellerRepository.findOne({ where: { email: dataGroupBySellerId[i].sellerId } })
      dataGroupBySellerId[i].name = u?.name;
    }

    dataGroupBySellerId.sort((a, b) => {
      return b.quantity - a.quantity;
    });

    return { data: dataGroupBySellerId, totalAmountTicket: this.getNumberOfTicket(dataGroupBySellerId) };
  }

  // TODO refactor with the one without edition
  async getAllSellersSellingsInformationByEdition(edition: string): Promise<{ data: any[], totalAmountTicket: number }> {
    const data = await this.sellingInformationRepository.find({
      where: { eventsquareReference: Not(IsNull()), edition },
      order: { sellerId: 'ASC' },
    });

    const dataGroupBySellerId = [];

    data.filter(d => {
      return !this.ticketsService.presenceOfTestTicket(d);
    }).forEach(d => {
      const index = dataGroupBySellerId.findIndex(x => x.sellerId === d.sellerId);
      if (index > -1) {
        dataGroupBySellerId[index].quantity += d.quantity;
        dataGroupBySellerId[index].details.push(d);
      } else {
        dataGroupBySellerId.push({
          sellerId: d.sellerId,
          quantity: d.quantity,
          details: [d],
        });
      }
    });

    for (let i = 0; i < dataGroupBySellerId.length; i++) {
      const u = await this.sellerRepository.findOne({ where: { email: dataGroupBySellerId[i].sellerId } })
      dataGroupBySellerId[i].name = u?.name;
    }

    dataGroupBySellerId.sort((a, b) => {
      return b.quantity - a.quantity;
    });

    return { data: dataGroupBySellerId, totalAmountTicket: this.getNumberOfTicket(dataGroupBySellerId) };
  }

  async getAllFinishSellingsInformation() {
    const sellers = await this.sellerRepository.find();
    const data = await firstValueFrom(
      from(this.sellingInformationRepository.find({
        where: { eventsquareReference: Not(IsNull()) },
      })).pipe(
        map(dataPipe => {
          return dataPipe.filter(d => {
            return !this.ticketsService.presenceOfTestTicket(d);
          }).map(d => {
            const postCodeNumber = parseInt(d.sellerPostalCode);
            let sellerDepartmentLabel = '';
            if (d.sellerDepartmentId === 'BASE' && isNumber(postCodeNumber)) {
              const province = provinces.find((p) =>
                p.ranges.find((r) => {
                  return r.start <= postCodeNumber && r.end >= postCodeNumber;
                }),
              );
              sellerDepartmentLabel = province.label;
            } else {
              sellerDepartmentLabel = departments.find(dep => dep.code === d.sellerDepartmentId).labelNl;
            }
            const sellerName = sellers.find(s => s.email === d.sellerId)?.name;
            return {
              ...d, sellerDepartmentLabel, sellerName
            }
          })
        })
      )
    );

    return {
      data,
      totalAmountTicket: this.getNumberOfTicket(data)
    };
  }

  async getAllFinishSellingsInformationByEdition(edition: string) {
    const sellers = await this.sellerRepository.find();
    const data = await firstValueFrom(
      from(this.sellingInformationRepository.find({
        where: { eventsquareReference: Not(IsNull()), edition },
      })).pipe(
        map(dataPipe => {
          return dataPipe.filter(d => {
            return !this.ticketsService.presenceOfTestTicket(d);
          }).map(d => {
            const postCodeNumber = parseInt(d.sellerPostalCode);
            let sellerDepartmentLabel = '';
            if (d.sellerDepartmentId === 'BASE' && isNumber(postCodeNumber)) {
              const province = provinces.find((p) =>
                p.ranges.find((r) => {
                  return r.start <= postCodeNumber && r.end >= postCodeNumber;
                }),
              );
              sellerDepartmentLabel = province?.label;
            } else {
              sellerDepartmentLabel = departments.find(dep => dep.code === d.sellerDepartmentId)?.labelNl;
            }
            const sellerName = sellers.find(s => s.email === d.sellerId)?.name;
            return {
              ...d, sellerDepartmentLabel, sellerName
            }
          })
        })
      )
    );

    return {
      data,
      totalAmountTicket: this.getNumberOfTicket(data)
    };
  }

  async getAllFinishSellingsInformationTickets() {
    const dataNet = [];
    const dataBrut = await this.getAllFinishSellingsInformation();
    dataBrut.data.filter(d => {
      return !this.ticketsService.presenceOfTestTicket(d);
    }).forEach(db => {
      db.ticketInfo.forEach(ti => {
        // TODO Check if we can put the field ticketAmount instead of push one by amount ...
        for (let i = 0; i < ti.ticketAmount; i++) {
          dataNet.push({
            type: ti.ticketLabel,
            channel: db['sellerDepartmentLabel'],
            zip: db.sellerPostalCode,
            price: ti.ticketPrice,
            clientName: db.clientName,
            sellerId: db.sellerId,
            sellerName: db['sellerName'],
            date: db.finishDate,
            workGroup: db.fromWorkGroup,
            merchRef: db.clientTransactionId,
          })
        }
      });
    })
    return dataNet;
  }

  async getAllFinishSellingsInformationTicketsByEdition(edition: string) {
    const dataNet = [];
    const dataBrut = await this.getAllFinishSellingsInformationByEdition(edition);
    dataBrut.data.filter(d => {
      return !this.ticketsService.presenceOfTestTicket(d);
    }).forEach(db => {
      db.ticketInfo.forEach(ti => {
        // TODO Check if we can put the field ticketAmount instead of push one by amount ...
        for (let i = 0; i < ti.ticketAmount; i++) {
          dataNet.push({
            orderCode: db['eventsquareReference'],
            type: ti.ticketLabel,
            channel: db['sellerDepartmentLabel'],
            zip: db.sellerPostalCode,
            price: ti.ticketPrice,
            clientName: db.clientName,
            sellerId: db.sellerId,
            sellerName: db['sellerName'],
            date: db.finishDate,
            workGroup: db.fromWorkGroup,
            merchRef: db.clientTransactionId,
            id: db.id,
            department: db.sellerDepartmentId,
          })
        }
      });
    })
    return dataNet;
  }

  async getAllDepartmentsSellingsInformations() {
    const data = await this.sellingInformationRepository.find({
      where: { eventsquareReference: Not(IsNull()) },
      order: { sellerDepartmentId: 'ASC' }
    });

    const dataGroupBySellerDepartmentId = [];

    data.filter(d => {
      return !this.ticketsService.presenceOfTestTicket(d);
    }).forEach(d => {

      const postCodeNumber = parseInt(d.sellerPostalCode);
      if (d.sellerDepartmentId === 'BASE' && isNumber(postCodeNumber)) {
        const province = provinces.find((p) =>
          p.ranges.find((r) => {
            return r.start <= postCodeNumber && r.end >= postCodeNumber;
          }),
        );
        d.sellerDepartmentId = province.code;
        d['name'] = province.label;
      }

      const index = dataGroupBySellerDepartmentId.findIndex(
        x => x.sellerDepartmentId === d.sellerDepartmentId
      );
      if (index > -1) {
        dataGroupBySellerDepartmentId[index].quantity += d.quantity;
        dataGroupBySellerDepartmentId[index].details.push(d);
      } else {
        dataGroupBySellerDepartmentId.push({
          sellerDepartmentId: d.sellerDepartmentId,
          quantity: d.quantity,
          name: d['name'] || departments.find(department => department.code === d.sellerDepartmentId)?.label,
          details: [d],
        });
      }
    });

    return {
      data: dataGroupBySellerDepartmentId,
      totalAmountTicket: this.getNumberOfTicket(dataGroupBySellerDepartmentId)
    };
  }

  async getAllDepartmentsSellingsInformationsByEdition(edition: string) {
    const data = await this.sellingInformationRepository.find({
      where: { eventsquareReference: Not(IsNull()), edition },
      order: { sellerDepartmentId: 'ASC' }
    });

    const dataGroupBySellerDepartmentId = [];

    data.filter(d => {
      return !this.ticketsService.presenceOfTestTicket(d);
    }).forEach(d => {

      const postCodeNumber = parseInt(d.sellerPostalCode);
      if (d.sellerDepartmentId === 'BASE' && isNumber(postCodeNumber)) {
        const province = provinces.find((p) =>
          p.ranges.find((r) => {
            return r.start <= postCodeNumber && r.end >= postCodeNumber;
          }),
        );
        d.sellerDepartmentId = province.code;
        d['name'] = province.label;
      }

      const index = dataGroupBySellerDepartmentId.findIndex(
        x => x.sellerDepartmentId === d.sellerDepartmentId
      );
      if (index > -1) {
        dataGroupBySellerDepartmentId[index].quantity += d.quantity;
        dataGroupBySellerDepartmentId[index].details.push(d);
      } else {
        dataGroupBySellerDepartmentId.push({
          sellerDepartmentId: d.sellerDepartmentId,
          quantity: d.quantity,
          name: d['name'] || departments.find(department => department.code === d.sellerDepartmentId)?.label,
          details: [d],
        });
      }
    });

    return {
      data: dataGroupBySellerDepartmentId,
      totalAmountTicket: this.getNumberOfTicket(dataGroupBySellerDepartmentId)
    };
  }


  async getOrderNotFinish() {
    return (await this.sellingInformationRepository.find({
      where: { eventsquareReference: IsNull() }
    })).filter(d => {
      return !this.ticketsService.presenceOfTestTicket(d);
    });
  }

  async getOrderNotFinishByEdition(edition: string) {
    return (await this.sellingInformationRepository.find({
      where: { eventsquareReference: IsNull(), edition }
    })).filter(d => {
      return !this.ticketsService.presenceOfTestTicket(d);
    });
  }

  getOneLongText(label: string, lang: string) {
    return this.longtextRepository.findOne({ where: { label, lang } });
  }

  async editOneLongText(longtext: EditLongtextDto) {
    let longtextEdit = await this.longtextRepository.findOne({ where: { label: longtext.label, lang: longtext.lang } });
    longtextEdit.text = longtext.text;
    return this.longtextRepository.save(longtextEdit);
  }

  // Refactor and use the simple service to finish order with viva wallet id
  async finishOrderWithArrayOfTransactionId(finishOrders: FinishOrderTransactionIdDto[]) {
    const ordersNotFinish = await this.getOrderNotFinish();
    let ordersNotFinishFixedNeeded = ordersNotFinish.filter(onf => finishOrders.find(fo => fo.clientTransactionId === onf.clientTransactionId));

    ordersNotFinishFixedNeeded = ordersNotFinishFixedNeeded.map(o => {
      return {
        ...o,
        vwTransactionId: finishOrders.find(fo => fo.clientTransactionId === o.clientTransactionId).vwTransactionId
      }
    })

    for (let i = 0; i < ordersNotFinishFixedNeeded.length; i++) {
      const orderNotFinishFixedNeeded = ordersNotFinishFixedNeeded[i];
      const order = await this.sellingInformationRepository.findOne(
        { where: { clientTransactionId: orderNotFinishFixedNeeded.clientTransactionId } }
      );
      order.vwTransactionId = null;
      await this.sellingInformationRepository.save(order);

      const otherVwTransaction = await this.sellingInformationRepository.findOne(
        { where: { vwTransactionId: orderNotFinishFixedNeeded.vwTransactionId } }
      );

      if (!otherVwTransaction) {
        order.vwTransactionId = orderNotFinishFixedNeeded.vwTransactionId;
        await this.sellingInformationRepository.save(order);
      } else {
        order.vwTransactionId = otherVwTransaction.vwTransactionId;
        order.eventsquareReference = otherVwTransaction.eventsquareReference;
        order.clientTransactionId = orderNotFinishFixedNeeded.clientTransactionId;
        await this.sellingInformationRepository.save(order);
        await this.sellingInformationRepository.delete({ id: otherVwTransaction.id });

        ordersNotFinishFixedNeeded[i]['maybeDuplicate'] = true;
      }
    }

    return ordersNotFinishFixedNeeded;

    for (let i = 0; i < ordersNotFinishFixedNeeded.length; i++) {
      const orderNotFinishFixedNeeded = ordersNotFinishFixedNeeded[i];
      const dto: FinishOrderDto = {
        clientTransactionId: orderNotFinishFixedNeeded.clientTransactionId,
        vwTransactionId: orderNotFinishFixedNeeded.vwTransactionId,
        ticketInfo: orderNotFinishFixedNeeded.ticketInfo,
      };
      // await this.finishOrder(dto)
    }

    return ordersNotFinishFixedNeeded;
  }

  async beepleFunctions() {
    const token = (await this.sellersService.connectBeeple({ email: env.BEEPLE_ADMIN_MAIL, password: env.BEEPLE_ADMIN_PASSWORD, department: null })).token;
    return this.httpService.get<any>(`https://volunteers.manifiesta.be/api/v1/admin/functions`, { headers: { Token: token } }).pipe(
      map(d => {
        return d.data;
      })
    );
  }

  async editOneSellingsInformations(editSellingsInformations: EditSellingsInformationDTO, id: string) {
    const sellingInformation = await this.sellingInformationRepository.findOne({where: {id: parseInt(id)}});

    if (sellingInformation) {
      if (editSellingsInformations.sellerPostalCode) {
        sellingInformation.sellerPostalCode = editSellingsInformations.sellerPostalCode;
      }
      if (editSellingsInformations.sellerDepartmentId) {
        sellingInformation.sellerDepartmentId = editSellingsInformations.sellerDepartmentId;
      }
      if (Object.keys(editSellingsInformations).includes('fromWorkGroup')) {
        sellingInformation.fromWorkGroup = editSellingsInformations.fromWorkGroup;
      }

      await this.sellingInformationRepository.save(sellingInformation);
      return sellingInformation;
    } else {
      throw new HttpException(
        {
          message: ['this selling information dont exist'],
          code: 'selling-information-unknown',
        },
        HttpStatus.NOT_MODIFIED,
      );
    }

  }

}
