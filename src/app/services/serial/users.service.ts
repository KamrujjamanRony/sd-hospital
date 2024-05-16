import { Injectable, inject } from '@angular/core';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import axios from 'axios';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  http = inject(HttpClient);
  queryClient = injectQueryClient();

  apiClient = axios.create({
    baseURL: environment.userApi,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })

  doctorsQuery = injectQuery(() => ({
    queryKey: ['users'],
    queryFn: () => this.getUsers(),
  }));

  constructor() { }

  async getUsers(): Promise<any[]> {
    try {
      const response = await this.apiClient.get<any[]>('/GetUserRoleList');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      // Optionally rethrow the error or return a default value
      throw error;
    }
  }

  getUserRole(userId: any): Observable<any> {
    return this.http.get<any[]>(`${environment.userApi}/GetUserRolesByUserId?userId=${userId}`);
  }

  //   async addUser(model: any | FormData): Promise<any>{
  //     try {
  //       const response = await this.apiClient.post('/users', model);
  //       return response.data;
  //     } catch (error) {
  //       console.error('Error fetching users:', error);
  //       // Optionally rethrow the error or return a default value
  //       throw error;
  //     }
  //   }

  async updateUser(userId: any, updateRoles: any): Promise<any> {
    try {
      const response = await this.apiClient.post(`/UpdateUserRole?userId=${userId}`, updateRoles);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      // Optionally rethrow the error or return a default value
      throw error;
    }
  };

  //   async deleteUser(id: any): Promise<any>{
  //     try {
  //       const response = await this.apiClient.delete(`/users/${id}`);
  //       return response;
  //     } catch (error) {
  //       console.error('Error fetching users:', error);
  //       // Optionally rethrow the error or return a default value
  //       throw error;
  //     }
  //   }

  getUser(id: any): any {
    const users = this.queryClient.getQueryData(['users']) as any[];
    return users?.find((d) => d.id == id);
  }
}
