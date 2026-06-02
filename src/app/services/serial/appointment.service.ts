import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  constructor(private http: HttpClient) { }

  private apiUrl = environment.rootApi + '/Appointment/';

  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAppointment(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}GetAppointmentById?id=${id}`);
  }

  addAppointment(model: any | FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, model);
  }

  updateAppointment(id: any, updateData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}EditAppointment/${id}`, updateData);
  }

  deleteAppointment(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}DeleteAppointment?id=${id}`);
  }
}