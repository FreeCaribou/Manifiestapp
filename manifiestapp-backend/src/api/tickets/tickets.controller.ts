import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ConfirmTicketsDto } from './dto/confirm-tickets.dto';
import { NewsletterAddDto } from './dto/newsletter-add.dto';
import { PreparTicketsDto } from './dto/prepar-tickets.dto';
import { TicketsService } from './tickets.service';
import { TicketsGateway } from './tickets.gateway';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DepartmentsService } from '../departments/departments.service';

@Controller('api/tickets')
export class TicketsController {
  vwMerchantId = process.env.VIVA_WALLET_MERCHANT_ID;
  vwApiKey = process.env.VIVA_WALLET_API_KEY;

  constructor(
    private httpService: HttpService,
    private readonly ticketsService: TicketsService,
    private ticketsGateway: TicketsGateway,
    private departmentsService: DepartmentsService
  ) { }
  
  @Get(['/test'])
  test() {
    return this.ticketsService.test();
  }

  @Get(['/types/:shop', '/types'])
  findAll(@Param('shop') shop = 'app') {
    return this.ticketsService.getAllTicketTypes(shop);
  }

  // Prepar the ordering before the payment
  @Post('/prepar')
  preparOrder(@Body() preparTickets: PreparTicketsDto) {
    return this.ticketsService.preparOrder(preparTickets);
  }

  // Finish the order by passing the viva wallet id
  @Get('/finishOrderPending/:vwId')
  finishOrderWithVivaWalletTransactionId(@Param('vwId') vwId: string) {
    return this.ticketsService.poolingTicket(vwId);
  }

  // Retrieve a viva wallet transaction by his id
  @Get('/transaction/:id')
  getTransactionById(@Param('id') id: string) {
    return this.ticketsService.getTransactionById(id);
  }

  @Get('/sellingInformation/seller/top-ten/:edition')
  getAllSellerSellingInformationTopTen(@Param('edition') edition: string) {
    return this.ticketsService.getTopTenSeller(edition);
  }

  @Get('/sellingInformation/seller/:id')
  getSellerSellingInformation(@Param('id') id: string) {
    return this.ticketsService.getSellerSellingInformation(id);
  }

  @Get('/sellingInformation/seller/:id/:edition')
  getSellerSellingInformationForEdition(@Param('id') id: string, @Param('edition') edition: string) {
    return this.ticketsService.getSellerSellingInformationForEdition(id, edition);
  }

  @Get('/sellingInformation/department/top-ten/:id/:postCode/:edition')
  getOneDepartmentSellingInformationTopTen(
    @Param('id') id: string,
    @Param('postCode') postCode: string,
    @Param('edition') edition: string,
  ) {
    return this.ticketsService.getMyDepartmentTopTen(id, postCode, edition);
  }

  @Get('/sellingInformation/postCode/:postCode/:departmentCode/:fromWorkGroup/:edition')
  getOnePostCodeSellingInformation(
    @Param('postCode') postCode: string,
    @Param('departmentCode') departmentCode: string,
    @Param('fromWorkGroup') fromWorkGroup: string,
    @Param('edition') edition: string
  ) {
    return this.ticketsService.getOnePostCodeSellingInformation(
      postCode,
      departmentCode,
      fromWorkGroup,
      edition,
    );
  }

  @Post('/newsletter-add')
  newsletterAddMember(@Body() newsletterAdd: NewsletterAddDto) {
    return this.ticketsService.newsletterAddMember(newsletterAdd);
  }

  @Post('/seller/qrcode/app')
  getSellerQrCodeApp(@Body() paymentOrder: any) {
    return this.ticketsService.getPayconicQrCode(paymentOrder, true);
  }

  @Post('/seller/qrcode')
  getSellerQrCode(@Body() paymentOrder: any) {
    return this.ticketsService.getPayconicQrCode(paymentOrder, false);
  }


  // Viva wallet hook part

  getWebhookKey() {
    const req = firstValueFrom(
      this.httpService.get<any>(
        `https://www.vivapayments.com/api/messages/config/token`,
        {
          auth: {
            username: this.vwMerchantId,
            password: this.vwApiKey,
          },
        },
      ),
    );
    const promise2 = req
      .then((v) => {
        console.log('val', v.data.Key);
        return v.data;
      })
      .catch((err) => {
        console.log('err', err);
      });

    return promise2;
  }

  // Route used by viva wallet to retrieve our identity
  @Get('/vw/webhooks/payment/success')
  getWebhooksVwPaymentSuccess() {
    return this.getWebhookKey();
  }

  // Route that will be used by Viva Wallet to send us the notification of a new paiment
  // The body look like https://developer.viva.com/webhooks-for-payments/transaction-payment-created/#response-example
  // The usefull id is EventData.TransactionId, this is with that that we will retrieve the usefull info
  @Post('/vw/webhooks/payment/success')
  postWebhooksVwPaymentSuccess(@Body() body: any) {
    this.ticketsService.finishOrderWithVivaWalletTransactionId(body.EventData.TransactionId);
  }

}
