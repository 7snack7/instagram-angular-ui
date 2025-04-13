import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/User';
import {Observable} from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public login(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username: user.username,
      password: user.password
    });
  }

  public register(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      email: user.email,
      username: user.user,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      confirmPassword: user.confirmPassword
    });
  }

}
