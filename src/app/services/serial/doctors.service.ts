import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.DoctorApi;

  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCompanyDoctor(): Observable<any[]> {
    return this.getDoctors().pipe(
      map(Doctor => Doctor.filter(a => a.companyID === environment.hospitalCode))
    );
  }

  addDoctor(model: any | FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, model);
  }

  updateDoctor(id: any, updateData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/EditDoctor/${id}`, updateData);
  }

  deleteDoctor(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteDoctor?id=${id}`);
  }

  getDoctorById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetDoctorById?id=${id}`);
  }
}