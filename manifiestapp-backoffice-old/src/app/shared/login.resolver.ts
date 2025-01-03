import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { Observable, of, EMPTY } from 'rxjs';
import { LoginService } from './services/communication/login.service';
import { RoleEnum } from './services/communication/role.enum';

@Injectable({
  providedIn: 'root'
})
export class LoginResolver implements Resolve<Observable<boolean>> {
  constructor(private loginService: LoginService, private router: Router) { }
  
  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    if (!this.loginService.getToken()) {
      this.router.navigate(['/login']);
      return EMPTY;
    }

    const roles = this.loginService.getRoles();

    if (roles?.includes(RoleEnum.ADMIN)) {
      return of(true);
    }

    if (!roles?.includes(route.data?.['role'])) {
      this.router.navigate(['/login']);
      return EMPTY;
    }

    return of(true);
  }
}
