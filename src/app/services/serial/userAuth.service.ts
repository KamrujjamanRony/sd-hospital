import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private http = inject(HttpClient);
  private usersService = inject(UsersService);
  private apiUrl = environment.authApi;

  registerUser(model: any | FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, model);
  }

  loginUser(model: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Login`, model);
  }
}