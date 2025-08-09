import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = environment.userApi;

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetUserRoleList`);
  }

  getUserRole(userId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetUserRolesByUserId?userId=${userId}`);
  }

  updateUser(userId: any, updateRoles: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/UpdateUserRole?userId=${userId}`, updateRoles);
  }

  getUser(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetUserById?id=${id}`);
  }
}