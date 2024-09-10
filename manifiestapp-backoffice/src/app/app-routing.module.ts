import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageDepartmentsComponent } from './pages/page-departments/page-departments.component';
import { PageHomeComponent } from './pages/page-home/page-home.component';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PagePhysicalTicketsComponent } from './pages/page-physical-tickets/page-physical-tickets.component';
import { PageSellerComponent } from './pages/page-seller/page-seller.component';
import { LoginResolver } from './shared/login.resolver';
import { PageOrderNotFinishComponent } from './pages/page-order-not-finish/page-order-not-finish.component';
import { PageSellingsTicketsComponent } from './pages/page-sellings-tickets/page-sellings-tickets.component';
import { PageLongTextComponent } from './pages/page-volunteer/page-volunteer.component';
import { RoleEnum } from './shared/services/communication/role.enum';

const routes: Routes = [
  { path: 'home', component: PageHomeComponent, resolve: { login: LoginResolver }, data: {role: RoleEnum.SECRETARY} },
  { path: 'departments', component: PageDepartmentsComponent, resolve: { login: LoginResolver }, data: {role: RoleEnum.SECRETARY} },
  { path: 'sellings-tickets', component: PageSellingsTicketsComponent, resolve: { login: LoginResolver }, data: {role: RoleEnum.SECRETARY} },
  { path: 'sellers', component: PageSellerComponent, resolve: { login: LoginResolver }, data: {role: RoleEnum.SECRETARY} },
  { path: 'physical-tickets', component: PagePhysicalTicketsComponent, resolve: { login: LoginResolver }, data: {role: RoleEnum.AFTER_SALE_SERVICE} },
  { path: 'order-not-finish', component: PageOrderNotFinishComponent, resolve: { login: LoginResolver }, data: {role: RoleEnum.AFTER_SALE_SERVICE} },
  { path: 'longtext', component: PageLongTextComponent, resolve: { login: LoginResolver }, data: {role: RoleEnum.VOLUNTEER_TEAM} },
  { path: 'login', component: PageLoginComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
