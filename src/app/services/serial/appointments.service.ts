import { environment } from './../../../environments/environments';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
    http = inject(HttpClient);
    
    getAppointmentData(from: any, to: any): Observable<any> {
      return this.http.get<any>(environment.rootApi + `/Appointment?fromDate=${from}&toDate=${to ? to : from}`);
    }

    getAppointmentDataById(id: any): Observable<any> {
      return this.http.get<any>(environment.rootApi + `/Appointment/GetAppointmentById?id=${id}`);
    }

    addAppointmentData(model: any | FormData): Observable<void>{
      return this.http.post<void>(`${environment.rootApi}/Appointment`, model)
    }

    updateAppointmentData(id: any, updateAppointmentDataRequest: any | FormData): Observable<any>{
      return this.http.put<any>(`${environment.rootApi}/Appointment/EditAppointment/${id}`, updateAppointmentDataRequest);
    }
  
    deleteAppointmentData(id: any): Observable<any>{
      return this.http.delete<any>(`${environment.rootApi}/Appointment/DeleteAppointment?id=${id}`)
    }

}
