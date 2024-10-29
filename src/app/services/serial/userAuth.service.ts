import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import axios from 'axios';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  http = inject(HttpClient);
  UsersService = inject(UsersService);
  queryClient = injectQueryClient();

  apiClient = axios.create({
    baseURL: environment.authApi,
    // headers: {
    //   'Content-Type' : 'application/json',
    //   'Accept' : 'application/json'
    // }
  })

  query = injectQuery(() => ({
    queryKey: ['users'],
    queryFn: () => this.UsersService.getUsers(),
  }));

  async registerUser(model: any | FormData): Promise<any>{
    try {
      const response = await this.apiClient.post('/', model);
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  } 

  // registerUser( model: any | FormData): Observable<void>{
  //   return this.http.post<void>(environment.authApi, model)
  // }

  loginUser(model: any): Observable<void>{
    return this.http.post<void>(`${environment.authApi}/Login`, model)
  }
}
