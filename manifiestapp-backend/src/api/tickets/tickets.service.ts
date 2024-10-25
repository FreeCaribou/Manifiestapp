import puppeteer, { ElementHandle } from 'puppeteer';
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isBoolean, isNumber } from 'class-validator';
import { log, timeStamp } from 'console';
import { firstValueFrom, map, forkJoin, catchError, tap } from 'rxjs';
import { IsNull, Not, Repository } from 'typeorm';
import { URLSearchParams } from 'url';
import { Seller } from '../sellers/seller.entity';
import { departments, provinces } from '../shared/data/departments.list';
import { Address } from './address.entity';
import { ConfirmTicketsDto } from './dto/confirm-tickets.dto';
import { NewsletterAddDto } from './dto/newsletter-add.dto';
import { PreparTicketsDto } from './dto/prepar-tickets.dto';
import { SellingInformation } from './selling-information.entity';
// import FormData from 'form-data';

// TODO avoid all duplicate here ! clean code

@Injectable()
export class TicketsService {
  apiKey = process.env.EVENT_SQUARE_API_KEY;
  posToken = process.env.EVENT_SQUARE_POS_TOKEN;

  vwSecret = process.env.VIVA_WALLET_SMART_CHECKOUT_SECRET;
  vwClient = process.env.VIVA_WALLET_SMART_CHECKOUT_CLIENT_ID;

  userES = process.env.EVENT_SQUARE_USER;
  passwordES = process.env.EVENT_SQUARE_PASSWORD;

  acceptedShop = ['app', 'comac', 'redfox', 'base', 'gvhv', 'other', 'cubanismo', 'intal', 'marianne', 'zelle'];

  constructor(
    private httpService: HttpService,
    @InjectRepository(SellingInformation)
    private readonly sellingInformationRepository: Repository<SellingInformation>,
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) { }

  private reduceName(name: string, workGroup = false): string {
    if (!name) {
      return undefined;
    }
    const split = name?.split(' ');
    const firstName = split?.shift();
    const lastName = split?.map((e) => e[0]).join('');

    return `${workGroup && firstName ? firstName[0] : firstName} ${lastName}`
  }

  getAllTicketTypes(shop: string = 'app') {
    // return [];
    return firstValueFrom(
      this.httpService.get<any>(
        `https://api.eventsquare.io/1.0/store/manifiesta/2024/${this.acceptedShop.includes(shop.toLowerCase())
          ? shop.toLowerCase() : 'app'}`, {
        headers: {
          apiKey: this.apiKey,
        }
      }).pipe(
        // TODO generic map for the .data from AXIOS
        map(d => { return d.data }),
        map(data => { return data.edition.channel.types }),
        map(tickets => { return Array.from(tickets).filter(t => t['type'] === 'ticket') }),
      )
    );
  }

  presenceOfTestTicket(sellingInfo: SellingInformation): boolean {
    return sellingInfo.ticketInfo.findIndex(ts => {
      return ts?.ticketLabel?.includes('[TEST]')
    }) > -1;
  }

  async preparOrder(preparTickets: PreparTicketsDto) {
    const seller = await this.sellerRepository.findOne({
      where: { email: preparTickets.sellerId },
    });
    if (!seller) {
      await this.sellerRepository.save(
        await this.sellerRepository.create({
          email: preparTickets.sellerId,
          name: preparTickets.sellerName,
          workGroup: preparTickets.fromWorkGroup,
        }),
      );
    } else {
      seller.name = preparTickets.sellerName;
      seller.workGroup = preparTickets.fromWorkGroup;
      this.sellerRepository.save(seller);
    }

    let quantity = 0;
    preparTickets.tickets.forEach((e) => {
      quantity += e.ticketAmount;
    });

    const sellingInformation = await this.sellingInformationRepository.save(
      this.sellingInformationRepository.create({
        orderDate: new Date(),
        sellerDepartmentId: preparTickets.sellerDepartmentId,
        sellerId: preparTickets.sellerId,
        sellerPostalCode: preparTickets.sellerPostalCode,
        ticketInfo: preparTickets.tickets,
        quantity: quantity,
        clientTransactionId: preparTickets.clientTransactionId,
        clientName: preparTickets.firstname,
        clientLastName: preparTickets.lastname,
        fromWorkGroup: preparTickets.fromWorkGroup,
        clientEmail: preparTickets.email,
        edition: preparTickets.edition || new Date().getFullYear().toString(),
      }));


    // If the client demand a physical ticket
    if (preparTickets.askSendTicket) {
      await this.addressRepository.save(
        await this.addressRepository.create({
          city: preparTickets.address.city,
          firstName: preparTickets.firstname,
          lastName: preparTickets.lastname,
          number: preparTickets.address.number,
          postCode: preparTickets.address.postCode,
          street: preparTickets.address.street,
          sendDone: false,
          sellingInformationId: sellingInformation.id.toString(),
        }),
      );
    }

    return sellingInformation;
  }

  async getTransactionById(id: string) {
    const bodyXWWWFORMURLData = new URLSearchParams();
    bodyXWWWFORMURLData.append('grant_type', 'client_credentials');

    const accessToken = (
      await firstValueFrom(
        this.httpService
          .post<any>(
            `https://accounts.vivapayments.com/connect/token`,
            bodyXWWWFORMURLData,
            {
              auth: {
                password: this.vwSecret,
                username: this.vwClient,
              },
            },
          )
          .pipe(
            // TODO generic map for the .data from AXIOS
            map((d) => {
              return d.data;
            }),
          ),
      )
    ).access_token;

    return firstValueFrom(
      this.httpService
        .get<any>(
          `https://api.vivapayments.com/checkout/v2/transactions/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .pipe(
          // TODO generic map for the .data from AXIOS
          map((d) => {
            return d.data;
          }),
        ),
    ).catch((e) => {
      throw new HttpException(
        { message: ['error transaction not existing'] },
        HttpStatus.NOT_FOUND,
      );
    });
  }

  private getNumberOfTicket(data: any[]): number {
    let totalAmountTicket = 0;
    data.forEach((t) => {
      totalAmountTicket += t.quantity || 0;
    });
    return totalAmountTicket;
  }

  async getAllSellingInformation() {
    const data = await this.sellingInformationRepository.find();
    return { data, totalAmountTicket: this.getNumberOfTicket(data) };
  }

  async getSellerSellingInformation(id: string) {
    let data = await this.sellingInformationRepository.find({
      where: { sellerId: id, eventsquareReference: Not(IsNull()) },
      order: { finishDate: 'ASC' },
    });
    data = data.filter(d => {
      return !this.presenceOfTestTicket(d);
    }).map((d) => {
      return {
        ...d,
        sellerDepartment:
          departments.find((df) => df.code === d.sellerDepartmentId)?.label ||
          d.sellerDepartmentId,
        clientName: this.reduceName(d.clientName),
      };
    });
    return { data, totalAmountTicket: this.getNumberOfTicket(data) };
  }


  async getSellerSellingInformationForEdition(id: string, edition: string) {
    let data = await this.sellingInformationRepository.find({
      where: { sellerId: id, eventsquareReference: Not(IsNull()), edition },
      order: { finishDate: 'ASC' },
    });
    data = data.filter(d => {
      return !this.presenceOfTestTicket(d);
    }).map((d) => {
      return {
        ...d,
        sellerDepartment:
          departments.find((df) => df.code === d.sellerDepartmentId)?.label ||
          d.sellerDepartmentId,
        clientName: this.reduceName(d.clientName),
      };
    });
    return { data, totalAmountTicket: this.getNumberOfTicket(data) };
  }

  async getTopTenSeller(edition: string) {
    const myDepartmentInfo = await this.getAllSellerSellingInformation(edition);
    return myDepartmentInfo.data.slice(0, 10);
  }

  async getAllSellerSellingInformation(edition: string): Promise<{
    data: any[];
    totalAmountTicket: number;
  }> {
    let data = await this.sellingInformationRepository.find({
      where: { eventsquareReference: Not(IsNull()), edition },
      order: { sellerId: 'ASC' },
    });

    const dataGroupBySellerId = [];

    data = data.filter(d => {
      return !this.presenceOfTestTicket(d);
    });

    data.forEach((d) => {
      const index = dataGroupBySellerId.findIndex(
        (x) => x.sellerId === d.sellerId,
      );
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
      const u = await this.sellerRepository.findOne({
        where: { email: dataGroupBySellerId[i].sellerId },
      });
      dataGroupBySellerId[i].name = this.reduceName(u?.name, u?.workGroup);
      delete dataGroupBySellerId[i].sellerId;
      delete dataGroupBySellerId[i].details;
    }

    dataGroupBySellerId.sort((a, b) => {
      return b.quantity - a.quantity;
    });

    return {
      data: dataGroupBySellerId,
      totalAmountTicket: this.getNumberOfTicket(dataGroupBySellerId),
    };
  }

  async getMyDepartmentTopTen(
    sellerdepartmentId: string,
    sellerPostCode: string,
    edition: string,
  ) {
    const myDepartmentInfo = await this.getOneDepartmentSellingInformation(
      sellerdepartmentId,
      sellerPostCode,
      edition,
    );
    return myDepartmentInfo.bestSelling.slice(0, 10);
  }

  async getOneDepartmentSellingInformation(
    sellerdepartmentId: string,
    sellerPostCode: string,
    edition: string,
  ): Promise<{ data: any[]; bestSelling: any[]; totalAmountTicket: number }> {
    let province;
    const postCodeNumber = parseInt(sellerPostCode);
    if (sellerdepartmentId === 'BASE' && isNumber(parseInt(sellerPostCode))) {
      province = provinces.find((p) =>
        p.ranges.find((r) => {
          return r.start <= postCodeNumber && r.end >= postCodeNumber;
        }),
      );
    }

    let dataBrut = await this.sellingInformationRepository.find({
      where: {
        sellerDepartmentId: sellerdepartmentId,
        eventsquareReference: Not(IsNull()),
        edition,
      },
    });

    dataBrut = dataBrut.filter(d => {
      return !this.presenceOfTestTicket(d);
    });

    if (province) {
      dataBrut = dataBrut.filter((d) => {
        return province.ranges.find((r) => {
          return r.start <= d.sellerPostalCode && r.end >= d.sellerPostalCode;
        });
      });
    }

    const bestSelling = [];

    dataBrut.forEach((d) => {
      const index = bestSelling.findIndex((x) => x.sellerId === d.sellerId);
      if (index > -1) {
        bestSelling[index].quantity += d.quantity;
        bestSelling[index].details.push(d);
      } else {
        bestSelling.push({
          sellerId: d.sellerId,
          quantity: d.quantity,
          details: [d],
        });
      }
    });

    for (let i = 0; i < bestSelling.length; i++) {
      const u = await this.sellerRepository.findOne({
        where: { email: bestSelling[i].sellerId },
      });
      bestSelling[i].name = this.reduceName(u?.name, u?.workGroup);
      delete bestSelling[i].sellerId;
      delete bestSelling[i].details;
    }

    bestSelling.sort((a, b) => {
      return b.quantity - a.quantity;
    });

    return {
      data: dataBrut,
      bestSelling: bestSelling,
      totalAmountTicket: this.getNumberOfTicket(bestSelling),
    };
  }

  async getOnePostCodeSellingInformation(
    postalCode: string,
    departmentCode: string,
    fromWorkGroup: string,
    edition: string,
  ): Promise<{ data: any[]; bestSelling: any[]; totalAmountTicket: number }> {
    let dataBrut = await this.sellingInformationRepository.find({
      where: {
        sellerPostalCode: postalCode,
        eventsquareReference: Not(IsNull()),
        sellerDepartmentId: departmentCode,
        fromWorkGroup: fromWorkGroup === 'true',
        edition,
      },
    });

    dataBrut = dataBrut.filter(d => {
      return !this.presenceOfTestTicket(d);
    });

    const bestSelling = [];

    dataBrut.forEach((d) => {
      const index = bestSelling.findIndex((x) => x.sellerId === d.sellerId);
      if (index > -1) {
        bestSelling[index].quantity += d.quantity;
        bestSelling[index].details.push(d);
      } else {
        bestSelling.push({
          sellerId: d.sellerId,
          quantity: d.quantity,
          details: [d],
        });
      }
    });

    for (let i = 0; i < bestSelling.length; i++) {
      const u = await this.sellerRepository.findOne({
        where: { email: bestSelling[i].sellerId },
      });
      bestSelling[i].name = this.reduceName(u?.name, fromWorkGroup === 'true');
      delete bestSelling[i].sellerId;
      delete bestSelling[i].details;
    }

    bestSelling.sort((a, b) => {
      return b.quantity - a.quantity;
    });

    return {
      data: [],
      bestSelling: bestSelling,
      totalAmountTicket: this.getNumberOfTicket(bestSelling),
    };
  }

  async getAllDepartmentSellingInformation() {
    const data = await this.sellingInformationRepository.find({
      where: { eventsquareReference: Not(IsNull()) },
      order: { sellerDepartmentId: 'ASC' },
    });

    const dataGroupBySellerDepartmentId = [];

    data.forEach((d) => {
      const index = dataGroupBySellerDepartmentId.findIndex(
        (x) => x.sellerDepartmentId === d.sellerDepartmentId,
      );
      if (index > -1) {
        dataGroupBySellerDepartmentId[index].quantity += d.quantity;
        dataGroupBySellerDepartmentId[index].details.push(d);
      } else {
        dataGroupBySellerDepartmentId.push({
          sellerDepartmentId: d.sellerDepartmentId,
          quantity: d.quantity,
          name: departments.find(
            (department) => department.code === d.sellerDepartmentId,
          )?.label,
          details: [d],
        });
      }
    });

    return {
      data: dataGroupBySellerDepartmentId,
      totalAmountTicket: this.getNumberOfTicket(dataGroupBySellerDepartmentId),
    };
  }

  async newsletterAddMember(newsletterAdd: NewsletterAddDto) {
    const mailchimp = require('@mailchimp/mailchimp_marketing');

    mailchimp.setConfig({
      apiKey: process.env.MAILCHIMP_API,
      server: process.env.MAILCHIMP_SERVER_PREFIX,
    });

    const lists = await mailchimp.lists.getAllLists();
    const newsId = lists?.lists?.find((l) => l.name === 'ManiFiesta News')?.id;

    try {
      const add = await mailchimp.lists.addListMember(newsId, {
        email_address: newsletterAdd.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: newsletterAdd.firstname,
          LNAME: newsletterAdd.lastname,
          MMERGE6: newsletterAdd.MMERGE6,
        },
      });
    } catch (e) {
      console.error(e);
    }

    return { hello: 'world' };
  }

  async getVivaWaletAccessToken() {
    const bodyXWWWFORMURLData = new URLSearchParams();

    bodyXWWWFORMURLData.append('grant_type', 'client_credentials');

    const accessToken = (
      await firstValueFrom(
        this.httpService
          .post<any>(
            `https://accounts.vivapayments.com/connect/token`,
            bodyXWWWFORMURLData,
            {
              auth: {
                password: this.vwSecret,
                username: this.vwClient,
              },
            },
          )
          .pipe(
            // TODO generic map for the .data from AXIOS
            map((d) => {
              return d.data;
            }),
          ),
      )
    ).access_token;

    return accessToken;
  }

  async createPaymentOrder(orderInfo, forApp = false) {
    const accessToken = await this.getVivaWaletAccessToken();
    const amount = orderInfo.amount;
    const merchantTrns = orderInfo.merchantTrns;

    return firstValueFrom(
      this.httpService.post(
        'https://api.vivapayments.com/checkout/v2/orders',
        {
          amount,
          merchantTrns,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );
  }

  async getPayconicQrCode(paymentOrder: any, forApp = false) {
    // stupid bug with viva wallet and some order number that begin by 9
    let isBadOrderCode = false;
    let orderCodePromise;
    let orderCode;
    do {
      orderCodePromise = await this.createPaymentOrder(paymentOrder, forApp);
      orderCode = orderCodePromise.data.orderCode.toString();
      isBadOrderCode = orderCode[0] == '9';
    } while (isBadOrderCode)

    return { orderCode: orderCode.toString() }
  }

  /**
   * @param vivaWalletTransactionId the id from the viva wallet selling
   * @returns the informations of the selling
   * 
   * From the Viva Wallet Transaction Id, we get to the API all the information, include the merchand ref
   * This merchand ref is useful to retrieve the tickets informations for the selling
   * With all of that, we can finish the order
   * 
   * If the vw transaction id is already use, throw error
   * If the vw transaction id dont exist, throw error
   * 
   * TODO try in full asynchrone
   */
  async finishOrderWithVivaWalletTransactionId(vivaWalletTransactionId: string, avoidVerification = false) {
    let findAlreadyUseVwTransactionId = await this.sellingInformationRepository.findOne({
      where: { vwTransactionId: vivaWalletTransactionId },
    });

    if (findAlreadyUseVwTransactionId && !avoidVerification) {
      const orderDate = new Date(findAlreadyUseVwTransactionId.orderDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - orderDate.getTime());
      // 300 000 milli seconds for 5 minutes
      // We return just the order
      if (diffTime < 300000) {
        return {
          ...findAlreadyUseVwTransactionId,
          order: findAlreadyUseVwTransactionId.eventsquareReference,
          transactionInProgress: true,
        };
      } else {
        throw new HttpException(
          {
            message: ['error transaction already existing'],
            code: 'transaction-already-done',
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    const accessToken = await this.getVivaWaletAccessToken();

    const transactionVerification = await firstValueFrom(
      this.httpService
        .get<any>(
          `https://api.vivapayments.com/checkout/v2/transactions/${vivaWalletTransactionId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .pipe(
          map((d) => {
            return d.data;
          }),
        ),
    ).catch((e) => {
      throw new HttpException(
        {
          message: ['error transaction not existing'],
          code: 'transaction-not-existing',
        },
        HttpStatus.NOT_FOUND,
      );
    });

    const pendingTicket = await this.sellingInformationRepository.findOne({
      where: { clientTransactionId: transactionVerification.merchantTrns },
    });
    pendingTicket.vwTransactionId = vivaWalletTransactionId;
    await this.sellingInformationRepository.save(pendingTicket);

    // And command the EventSquare tickets
    const cartid = (
      await firstValueFrom(
        this.httpService
          .get<any>(
            'https://api.eventsquare.io/1.0/store/manifiesta/2024/app?language=nl&pos_token=' +
            this.posToken,
            {
              headers: {
                apiKey: this.apiKey,
              },
            },
          )
          .pipe(
            map((d) => {
              return d.data;
            }),
            catchError((e) => {
              return e;
            }),
          ),
      )
    ).edition.cart.cartid;

    const putTicketsInCart = pendingTicket.ticketInfo.map((t) => {
      return this.httpService.put<any>(
        `https://api.eventsquare.io/1.0/cart/${cartid}/types/${t.ticketId}?quantity=${t.ticketAmount}`,
        {},
        {
          headers: {
            apiKey: this.apiKey,
          },
        },
      );
    });

    await firstValueFrom(forkJoin(putTicketsInCart));

    const FormData = require('form-data');
    const bodyFormData = new FormData();
    bodyFormData.append('redirecturl', 'https://www.manifiesta.be');
    // TODO have firstname and lastname
    bodyFormData.append('customer[firstname]', pendingTicket.clientName);
    bodyFormData.append('customer[lastname]', pendingTicket.clientLastName);
    bodyFormData.append('customer[email]', pendingTicket.clientEmail);
    bodyFormData.append('customer[agent]', 'ManifiestApp');
    bodyFormData.append('customer[language]', 'nl');
    bodyFormData.append('customer[ip]', '127.0.0.1');
    bodyFormData.append('invoice', 0);
    bodyFormData.append('customer[data][sellerId]', pendingTicket.sellerId);
    bodyFormData.append('testmode', 0);

    console.log('the seller', pendingTicket.sellerId, pendingTicket.sellerDepartmentId)

    const jsonBody = {
      customer: {
        firstname: pendingTicket.clientName,
        lastname: pendingTicket.clientLastName,
        email: pendingTicket.clientEmail,
        agent: 'ManifiestApp',
        language: 'nl',
        ip: '127.0.0.1',
        data: {
          sellerId: pendingTicket.sellerId,
          sellerDepartmentId: pendingTicket.sellerDepartmentId,
          sellerPostalCode: pendingTicket.sellerPostalCode,
          clientTransactionId: pendingTicket.clientTransactionId,
          vwTransactionId: pendingTicket.vwTransactionId,
        }
      },
      testmode: 0,
      redirecturl: 'https://www.manifiesta.be',
      invoice: 0,
    }

    // console.log('body', jsonBody)

    const orderid = (
      await firstValueFrom(
        this.httpService
          .post<any>(
            `https://api.eventsquare.io/1.0/cart/${cartid}`,
            // bodyFormData,
            jsonBody,
            {
              headers: {
                apiKey: this.apiKey,
                // 'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>'
              },
            },
          )
          .pipe(
            map((d) => {
              return d.data;
            }),
            catchError(err => {
              console.warn('err for creating event square ticket', err.response.data)
              return null;
            })
          ),
      )
    ).order.orderid;

    const finalOrder = await firstValueFrom(
      this.httpService
        .get<any>(`https://api.eventsquare.io/1.0/checkout/${orderid}`, {
          headers: {
            apiKey: this.apiKey,
          },
        })
        .pipe(
          map((d) => {
            return d.data;
          }),
        ),
    );

    pendingTicket.eventsquareReference = finalOrder.order.reference;
    pendingTicket.vwTransactionId = vivaWalletTransactionId;
    pendingTicket.finishDate = new Date();
    await this.sellingInformationRepository.save(pendingTicket);

    const allSellerTicketsEdition = await this.getSellerSellingInformationForEdition(pendingTicket.sellerId, pendingTicket.edition);

    const addressAsk = await this.addressRepository.findOne({ where: { sellingInformationId: pendingTicket.id.toString() } })
    if (addressAsk) {
      addressAsk.eventsquareReference = finalOrder.order.reference;
      await this.addressRepository.save(addressAsk);
    }

    return {
      ...pendingTicket,
      order: finalOrder.order,
      totalTicketsForThisEditionForThisSeller: allSellerTicketsEdition.totalAmountTicket,
    };
  }

  // TODO refactor, in other place
  async authentificationEventSquare(): Promise<any> {
    return await firstValueFrom(this.httpService.post<any>(`https://api.eventsquare.io/1.0/authenticate`, {
      email: this.userES,
      password: this.passwordES,
    }, {
      headers: {
        apiKey: this.apiKey,
      },
    }).pipe(
      map((d) => {
        return d.data;
      }),
      catchError(err => {
        console.warn('err for get token', err.response.data)
        return null;
      })
    ));
  }

  async test() {
    return 'hello world and comrade v1'
  }

  async poolingTicket(vwId: string, iteration = 0) {
    const timing = [1000, 5000, 10000, 15000, 250000];

    const accessToken = await this.getVivaWaletAccessToken();

    const vwTransaction = await firstValueFrom(
      this.httpService
        .get<any>(
          `https://api.vivapayments.com/checkout/v2/transactions/${vwId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .pipe(
          map((d) => {
            return d.data;
          }),
        ),
    ).catch((e) => {
      throw new HttpException(
        {
          message: ['error transaction not existing'],
          code: 'transaction-not-existing',
        },
        HttpStatus.NOT_FOUND,
      );
    });

    console.log('the transaction', vwTransaction)

    const linkedOrder = await this.sellingInformationRepository.findOne({
      where: { clientTransactionId: vwTransaction.merchantTrns },
    });

    console.log('link order', linkedOrder)

    if (linkedOrder?.eventsquareReference || iteration >= 5) {
      // TODO check if it is the return that we want
      return linkedOrder;
    } else {
      // TODO we need to retry, but put some timer, and max one minute
      await setTimeout(() => {}, timing[iteration]);
      return this.poolingTicket(vwId, iteration + 1);
    }
  }

}
