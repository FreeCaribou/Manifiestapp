/**
 * Some string with query
 * It's to assemble them into some scenario
 */

import { DataSource, getConnection } from "typeorm";
import { Admin } from "./api/admins/admin.entity";
import { Department } from "./api/departments/department.entity";
import { EncryptionsService } from "./api/encryptions/encryptions.service";
import { Seller } from "./api/sellers/seller.entity";
import { Address } from "./api/tickets/address.entity";
import { SellingInformation } from "./api/tickets/selling-information.entity";
import { appDataSourceConfig } from "./data-source";
import { LongText } from "./api/admins/long-text.entity";
import { RoleEnum } from "./api/admins/role.enum";

const edition = '2024';

export async function mockingData() {
  const repo = await new DataSource(appDataSourceConfig()).initialize();
  await repo.dropDatabase();
  // repo.initialize();
  // we need to recall it to have again the table after the clean up
  await new DataSource(appDataSourceConfig()).initialize();
  const departments = await mockDepartments(repo);
  const sellers = await mockSellers(repo, departments);
  const address = await mockAddress(repo);
  const sellingInformation = await mockSellingInformation(repo);
  const admins = await mockAdmins(repo);
  const longtexts = await mockLongtext(repo);
}

async function mockLongtext(repo) {
  const longtextRepo = repo.getRepository(LongText);
  return [
    await longtextRepo.save(await longtextRepo.create({ label: 'volunteers-benefits', lang: 'fr', text: '<h1>Bonjour</h1>un tshirt' })),
    await longtextRepo.save(await longtextRepo.create({ label: 'volunteers-benefits', lang: 'nl', text: '<h1>Hallo</h1>een tshirt' })),
  ];
}

async function mockAdmins(repo) {
  const adminRepo = repo.getRepository(Admin);
  const e = new EncryptionsService();
  return [
    await adminRepo.save(await adminRepo.create({
      email: 'samy@manifiesta.com', password: await e.hash('qwerty'), extra: { roles: [RoleEnum.SECRETARY, RoleEnum.VOLUNTEER_TEAM] }
    })),
    await adminRepo.save(await adminRepo.create({ email: 'rosa@manifiesta.com', password: await e.hash('qwertz'), extra: { roles: [RoleEnum.ADMIN] } })),
  ];
}

async function mockDepartments(repo) {
  const departmentRepo = repo.getRepository(Department);
  return [
    await departmentRepo.save(departmentRepo.create({ label: 'BBW', code: 'BBW' })),
    await departmentRepo.save(departmentRepo.create({ label: 'Antwerpen', code: 'Antwerpen' })),
    await departmentRepo.save(departmentRepo.create({ label: 'IT - Communication', code: 'IT' })),
  ];
}

async function mockSellers(repo, departments: Department[]) {
  const sellerRepo = await repo.getRepository(Seller);
  const mainId = process.env.BEEPLE_TEST_ID || '007';
  return [
    await sellerRepo.save(sellerRepo.create({ email: 'samy@manifiesta.com', name: 'Samy Gnu' })),
    await sellerRepo.save(sellerRepo.create({ email: 'raoul@manifiesta.com', name: 'Raoul Mertens' })),
    await sellerRepo.save(sellerRepo.create({ email: 'rosa@manifiesta.com', name: 'Rosa Monaco', workGroup: true })),
    await sellerRepo.save(sellerRepo.create({ email: 'louise@manifiesta.com', name: 'Louise La Petroleuse' })),
    await sellerRepo.save(sellerRepo.create({ email: 'marx@manifiesta.com', name: 'Karlou' })),
    await sellerRepo.save(sellerRepo.create({ email: 'karl@manifiesta.com', name: 'Marxou' })),
    await sellerRepo.save(sellerRepo.create({ email: 'ange@manifiesta.com', name: 'Gélique' })),
    await sellerRepo.save(sellerRepo.create({ email: 'fritz@manifiesta.com', name: 'Kola' })),
    await sellerRepo.save(sellerRepo.create({ email: 'ric@manifiesta.com', name: 'Cola' })),
    await sellerRepo.save(sellerRepo.create({ email: 'republique@manifiesta.com', name: 'Melenchon' })),
    await sellerRepo.save(sellerRepo.create({ email: 'poutou@manifiesta.com', name: 'Poutou' })),
    await sellerRepo.save(sellerRepo.create({ email: 'john@manifiesta.com', name: 'Doe' })),
    await sellerRepo.save(sellerRepo.create({ email: 'doe@manifiesta.com', name: 'John' })),
    await sellerRepo.save(sellerRepo.create({ email: 'nota@manifiesta.com', name: 'Bene' })),
    await sellerRepo.save(sellerRepo.create({ email: 'bene@manifiesta.com', name: 'Nota' })),
  ];
}

async function mockAddress(repo) {
  const addressRepo = await repo.getRepository(Address);
  return [
    await addressRepo.save(addressRepo.create({
      eventsquareReference: 'FKV87745',
      firstName: 'Samy',
      lastName: 'Gnulol',
      street: 'Rue du Lombard',
      number: '1917',
      postCode: '1000',
      city: 'Brussels',
      sendDone: false,
      sellingInformationId: '2',
    })),
    await addressRepo.save(addressRepo.create({
      firstName: 'Flotal',
      lastName: 'Inrard',
      street: 'Rue Rosa',
      number: '1936',
      postCode: '1000',
      city: 'Brussels',
      sendDone: true,
      sellingInformationId: '1',
    })),
  ]
}

async function mockSellingInformation(repo) {
  const mainId = process.env.BEEPLE_TEST_ID || '007';
  const sellingInformationRepo = await repo.getRepository(SellingInformation);
  return [
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: process.env.ClientEmailEx1,
      sellerDepartmentId: 'BASE',
      sellerPostalCode: '1040',
      eventsquareReference: null,
      orderDate: new Date('2021-06-06'),
      quantity: 4,
      clientName: 'Test Ticket',
      clientLastName: 'Dev',
      clientTransactionId: process.env.MerchantTrnsEx1,
      clientEmail: process.env.ClientEmailEx1,
      ticketInfo: [
        { "ticketId": process.env.EsTestTicketId, "ticketAmount": 2, "ticketLabel": "Testouille", ticketPrice: 0.01 },
      ],
      edition,
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: process.env.ClientEmailEx1,
      sellerDepartmentId: 'BASE',
      sellerPostalCode: '1040',
      eventsquareReference: null,
      vwTransactionId: process.env.VwTransactionIdEx2,
      clientTransactionId: process.env.MerchantTrnsEx2,
      orderDate: new Date(),
      quantity: 4,
      clientName: 'Ticket Already selling',
      clientEmail: process.env.ClientEmailEx1,
      ticketInfo: [
        { "ticketId": process.env.EsTestTicketId, "ticketAmount": 2, "ticketLabel": "Testouille", ticketPrice: 0.01 },
      ],
      edition,
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'samy@manifiesta.com',
      edition,
      sellerDepartmentId: 'BASE',
      sellerPostalCode: '1040',
      vwTransactionId: '117',
      eventsquareReference: 'HO',
      orderDate: new Date('2021-06-06'),
      quantity: 4,
      clientName: 'Random Client 1',
      ticketInfo: [
        { "ticketId": "1", "ticketAmount": 2, "ticketLabel": "Regular Intal", ticketPrice: 0.01 },
        { "ticketId": "2", "ticketAmount": 2, "ticketLabel": "Weekend Intal", ticketPrice: 0.02 }
      ],
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'samy@manifiesta.com',
      edition,
      sellerDepartmentId: 'BASE',
      sellerPostalCode: '1040',
      fromWorkGroup: true,
      vwTransactionId: '118',
      eventsquareReference: 'PTB-666',
      orderDate: new Date('2021-04-04'),
      quantity: 1,
      clientName: 'Random Client 2',
      ticketInfo: [{ "ticketId": "1", "ticketAmount": 1, "ticketLabel": "Regular Intal", ticketPrice: 0.01 }]
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'rosa@manifiesta.com',
      sellerDepartmentId: 'BASE',
      sellerPostalCode: '5000',
      vwTransactionId: '120',
      eventsquareReference: 'CDH-666',
      orderDate: new Date(),
      quantity: 3,
      clientName: 'Random Client 3',
      ticketInfo: [{ "ticketId": "1", "ticketAmount": 3, "ticketLabel": "Regular Intal", ticketPrice: 0.01 }],
      edition,
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'samy@manifiesta.com',
      edition,
      sellerDepartmentId: 'Comac',
      sellerPostalCode: '5000',
      vwTransactionId: '119',
      eventsquareReference: 'PVDA-666',
      orderDate: new Date('2021-08-08'),
      quantity: 1,
      clientName: 'Random Client 4',
      ticketInfo: [{ "ticketId": "1", "ticketAmount": 1 }]
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'rosa@manifiesta.com',
      sellerDepartmentId: 'BASE',
      sellerPostalCode: '1000',
      vwTransactionId: '121',
      eventsquareReference: 'PVDA-667',
      orderDate: new Date(),
      quantity: 3,
      clientName: 'Random Client 5',
      ticketInfo: [{ "ticketId": "1", "ticketAmount": 3, "ticketLabel": "Regular Intal", ticketPrice: 0.01 }],
      edition,
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'louise@manifiesta.com',
      sellerDepartmentId: 'BASE',
      sellerPostalCode: '1000',
      vwTransactionId: '122',
      eventsquareReference: 'PVDA-668',
      orderDate: new Date(),
      quantity: 7,
      clientName: 'Random Client 6',
      ticketInfo: [{ "ticketId": "1", "ticketAmount": 7, "ticketLabel": "Regular Intal", ticketPrice: 0.01 }],
      edition,
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'orwell@manifiesta.com',
      sellerDepartmentId: 'BASE',
      sellerPostalCode: '1000',
      vwTransactionId: '122',
      eventsquareReference: 'PVDA-669',
      orderDate: new Date(),
      quantity: 2,
      clientName: 'Random Client 7',
      ticketInfo: [
        { "ticketId": "1", "ticketAmount": 1, "ticketLabel": "Regular Intal", ticketPrice: 0.01 },
        { "ticketId": "1", "ticketAmount": 1, "ticketLabel": "Regular Intal", ticketPrice: 0.01 }
      ],
      edition,
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'samy@manifiesta.com',
      edition,
      sellerDepartmentId: 'Comac',
      sellerPostalCode: '1000',
      vwTransactionId: '119',
      eventsquareReference: 'PVDA-666',
      orderDate: new Date('2021-06-06'),
      quantity: 1,
      clientName: 'Random Client 8',
      ticketInfo: [{ "ticketId": "1", "ticketAmount": 1 }],
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'marx@manifiesta.com',
      sellerDepartmentId: 'Comac',
      sellerPostalCode: '1000',
      vwTransactionId: '119',
      eventsquareReference: 'PVDA-666',
      orderDate: new Date(),
      quantity: 1,
      clientName: 'Random Client 9',
      ticketInfo: [{ "ticketId": "1", "ticketAmount": 1 }],
      edition,
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'karl@manifiesta.com',
      sellerDepartmentId: 'Comac',
      sellerPostalCode: '1000',
      vwTransactionId: '119',
      eventsquareReference: 'PVDA-666',
      orderDate: new Date(),
      quantity: 1,
      clientName: 'Random Client 10',
      ticketInfo: [{ "ticketId": "1", "ticketAmount": 1 }],
      edition,
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'ange@manifiesta.com',
      sellerDepartmentId: 'Comac',
      sellerPostalCode: '1000',
      vwTransactionId: '119',
      eventsquareReference: 'PVDA-666',
      orderDate: new Date(),
      quantity: 1,
      clientName: 'Random Client 11',
      ticketInfo: [{ "ticketId": "1", "ticketAmount": 1 }],
      edition,
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'fritz@manifiesta.com',
      sellerDepartmentId: 'Comac',
      sellerPostalCode: '1000',
      vwTransactionId: '119',
      eventsquareReference: 'PVDA-666',
      orderDate: new Date(),
      quantity: 1,
      clientName: 'Random Client 12',
      ticketInfo: [{ "ticketId": "1", "ticketAmount": 1 }],
      edition,
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'samy@manifiesta.com',
      sellerDepartmentId: 'Comac',
      sellerPostalCode: '1000',
      vwTransactionId: '119',
      eventsquareReference: 'PVDA-666',
      orderDate: new Date(),
      quantity: 1,
      clientName: 'Random Client 13',
      ticketInfo: [{ "ticketId": "1", "ticketAmount": 1 }],
      edition,
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'bene@manifiesta.com',
      sellerDepartmentId: 'Comac',
      sellerPostalCode: '1000',
      vwTransactionId: '119',
      eventsquareReference: 'PVDA-666',
      orderDate: new Date(),
      quantity: 1,
      clientName: 'Random Client 14',
      ticketInfo: [{ "ticketId": "1", "ticketAmount": 1 }],
      edition,
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'nota@manifiesta.com',
      sellerDepartmentId: 'Comac',
      sellerPostalCode: '1000',
      vwTransactionId: null,
      eventsquareReference: 'PVDA-666',
      orderDate: new Date(),
      quantity: 1,
      clientName: 'Random Client 15',
      clientEmail: 'random@client.nl',
      ticketInfo: [{ "ticketId": "1", "ticketAmount": 1 }],
      edition,
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'doe@manifiesta.com',
      sellerDepartmentId: 'Comac',
      sellerPostalCode: '1000',
      vwTransactionId: '119',
      eventsquareReference: 'PVDA-666',
      orderDate: new Date(),
      quantity: 1,
      clientName: 'Random Client 16',
      ticketInfo: [{ "ticketId": "1", "ticketAmount": 1 }],
      edition,
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'john@manifiesta.com',
      sellerDepartmentId: 'Comac',
      sellerPostalCode: '1000',
      vwTransactionId: '119',
      eventsquareReference: 'PVDA-666',
      orderDate: new Date(),
      quantity: 1,
      clientName: 'Random Client 17',
      ticketInfo: [{ "ticketId": "1", "ticketAmount": 1 }],
      edition,
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'poutou@manifiesta.com',
      sellerDepartmentId: 'Comac',
      sellerPostalCode: '1000',
      vwTransactionId: null,
      eventsquareReference: 'PVDA-666',
      orderDate: new Date(),
      quantity: 1,
      clientName: 'Random Client 18',
      clientEmail: 'random@client.nl',
      ticketInfo: [{ "ticketId": "1", "ticketAmount": 1 }],
      edition,
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'republique@manifiesta.com',
      sellerDepartmentId: 'Comac',
      sellerPostalCode: '1000',
      vwTransactionId: '119',
      eventsquareReference: 'PVDA-666',
      orderDate: new Date(),
      quantity: 1,
      clientName: 'Random Client 19',
      ticketInfo: [{ "ticketId": "1", "ticketAmount": 1 }],
      edition,
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'ric@manifiesta.com',
      sellerDepartmentId: 'Comac',
      sellerPostalCode: '1000',
      vwTransactionId: null,
      eventsquareReference: 'PVDA-666',
      orderDate: new Date(),
      quantity: 1,
      clientName: 'Random Client 20',
      clientEmail: 'random@client.nl',
      ticketInfo: [{ "ticketId": "1", "ticketAmount": 1 }],
      edition,
    })),
    await sellingInformationRepo.save(sellingInformationRepo.create({
      sellerId: 'samy@manifiesta.com',
      edition,
      sellerDepartmentId: 'BASE',
      sellerPostalCode: '1040',
      vwTransactionId: 'lolololol',
      eventsquareReference: 'YOLO',
      orderDate: new Date(),
      quantity: 4,
      clientName: 'Random Client 1',
      clientEmail: 'app@manifiesta.be',
      clientTransactionId: 'samy@manifiesta.com-timestamposef',
      ticketInfo: [
        { "ticketId": "328253926372", "ticketAmount": 2, "ticketLabel": "Regular Intal", ticketPrice: 0.01, ticketTotalPrice: 0.02 },
        { "ticketId": "328253926372", "ticketAmount": 2, "ticketLabel": "Weekend Intal", ticketPrice: 0.02, ticketTotalPrice: 0.04 },
        { "ticketId": "2", "ticketAmount": 2, "ticketLabel": "[TEST]", ticketPrice: 0.02 },
      ]
    })),
  ]

}