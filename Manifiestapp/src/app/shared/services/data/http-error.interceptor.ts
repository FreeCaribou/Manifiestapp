import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { forkJoin, from, Observable, throwError } from "rxjs";
import { catchError, mergeMap, switchMap } from "rxjs/operators";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private translate: TranslateService,
    private toastController: ToastController,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('error with some backend request', error, req);
        return from(this.handleError(req, next));
      })
    )
  }

  async handleError(req: HttpRequest<any>, next: HttpHandler) {
    const message = await this.translate.get('Error.Generic').toPromise();
    // TODO check the type of error to know what to return

    const toast = await this.toastController.create({
      header: 'Internet Error',
      message,
      icon: 'bug-outline',
      color: 'danger',
      duration: 10000,
    });
    toast.present();

    return next.handle(req).toPromise();
  }
}