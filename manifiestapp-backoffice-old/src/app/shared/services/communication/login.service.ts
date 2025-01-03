import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private user: User = undefined as unknown as User;

  user$ = new EventEmitter<User>();

  constructor(private http: HttpClient) { }

  setUser(user: User) {
    this.user = user;
    this.user$.next(this.user);
    localStorage.setItem('admin-token', user.token as string);
    localStorage.setItem('roles', ((user.extra.roles) as string[]).join());
  }

  getRoles() {
    return localStorage.getItem('roles')?.split(',') || [];
  }

  getUser(): User {
    return this.user;
  }

  getToken(): string {
    return localStorage.getItem('admin-token') as string;
  }

  logout() {
    this.user = undefined as unknown as User;
    this.user$.next(this.user);
    localStorage.removeItem('admin-token');
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}admins/login`, {email, password});
  }

}
