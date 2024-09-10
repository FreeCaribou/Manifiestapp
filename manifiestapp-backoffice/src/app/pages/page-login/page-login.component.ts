import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { User } from 'src/app/shared/models/user.interface';
import { SellersService } from 'src/app/shared/services/api/sellers.service';
import { LoaderService } from 'src/app/shared/services/communication/loader.service';
import { LoginService } from 'src/app/shared/services/communication/login.service';
import { sortData } from 'src/app/shared/utils/sort-data.utils';

@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
})
export class PageLoginComponent {

  loginForm!: FormGroup;
  token!: string;
  errorMessage: string = '';

  constructor(
    private sellersService: SellersService,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private loaderService: LoaderService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.token = this.loginService.getToken();

    this.loginService.user$.subscribe(u => {
      this.token = u?.token as string;
    });
  }

  login() {
    this.errorMessage = null as unknown as string;
    this.loaderService.startLoading(PageLoginComponent.name);
    this.loginService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(admin => {
      this.loginService.setUser(admin);
    }, err => {
      console.error('error ?', err);
      // TODO more generic error system
      if (err.error?.code === 'login-001') {
        this.errorMessage = 'Bad email !';
      } else if (err.error?.code === 'login-002') {
        this.errorMessage = 'Bad password !';
      } else {
        this.errorMessage = 'Bad login !';
      }
    }).add(() => {this.loaderService.stopLoading(PageLoginComponent.name)});
  }

  logout() {
    this.loginService.logout();
  }

}
