import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { PageSellerComponent } from './pages/page-seller/page-seller.component';
import { PageHomeComponent, SellerSellingModal } from './pages/page-home/page-home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PagePhysicalTicketsComponent } from './pages/page-physical-tickets/page-physical-tickets.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DepartmentSellingModal, PageDepartmentsComponent } from './pages/page-departments/page-departments.component';
import { MatSortModule } from '@angular/material/sort';
import { MenuComponent } from './menu/menu.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { FinishOrderModal, PageOrderNotFinishComponent } from './pages/page-order-not-finish/page-order-not-finish.component';
import { DetailsTicketsComponent } from './shared/components/details-tickets/details-tickets.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TicketsTypesCountComponent } from './shared/components/tickets-types-count/tickets-types-count.component';
import { EditSellingInfoModal, PageSellingsTicketsComponent } from './pages/page-sellings-tickets/page-sellings-tickets.component';
import { ExcelService } from './shared/services/communication/excel.service';
import { MatSelectModule } from '@angular/material/select';
import { PageLongTextComponent } from './pages/page-volunteer/page-volunteer.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

@NgModule({
  declarations: [
    AppComponent,
    PageSellerComponent,
    PageLongTextComponent,
    PageHomeComponent,
    PagePhysicalTicketsComponent,
    PageDepartmentsComponent,
    PageLoginComponent,
    MenuComponent,
    PageOrderNotFinishComponent,
    DetailsTicketsComponent,
    FinishOrderModal,
    SellerSellingModal,
    DepartmentSellingModal,
    TicketsTypesCountComponent,
    PageSellingsTicketsComponent,
    EditSellingInfoModal,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,

    // Ng Material stuff
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    LayoutModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSelectModule,
    MatPaginatorModule,

    CanvasJSAngularChartsModule,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    ExcelService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
