import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  constructor(private http: HttpClient) { }

  private apiUrl = environment.DepartmentApi;

  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addDepartment(model: any | FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, model);
  }

  updateDepartment(id: any, updateData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/EditDepartment/${id}`, updateData);
  }

  deleteDepartment(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteDepartment?id=${id}`);
  }

  getDepartmentById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetDepartmentById?id=${id}`);
  }

  getDepartmentByDoctorId(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetDepartmentByDoctorId?id=${id}`);
  }
}