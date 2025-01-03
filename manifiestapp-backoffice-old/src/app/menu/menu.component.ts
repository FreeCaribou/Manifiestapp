import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { LoginService } from '../shared/services/communication/login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  url = '';

  userIconColor = 'warn';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private loginService: LoginService,
  ) { }

  ngOnInit() {
    this.router.events.subscribe(r => {
      if (r instanceof NavigationEnd) {
        this.url = r.url;
      }
    });

    this.verifyUserIconColor();
    this.loginService.user$.subscribe(() => {
      this.verifyUserIconColor();
    })
  }

  verifyUserIconColor() {
    this.userIconColor = this.loginService.getToken() ? 'primary' : 'warn';
  }

}
