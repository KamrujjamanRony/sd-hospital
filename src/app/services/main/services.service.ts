import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private http: HttpClient) { }

  addServices(model: any | FormData): Observable<void>{
    return this.http.post<void>(`${environment.baseApi}/Services`, model)
  }

  getAllServices(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseApi}/Services`);
  }

  getCompanyServices(): Observable<any[]> {
    return this.getAllServices().pipe(
      map(Services => Services.filter(a => a.companyID === environment.hospitalCode))
    );
  }

  getServices(id: any): Observable<any>{
    return this.http.get<any>(`${environment.baseApi}/Services/GetServicesById?id=${id}`);
  }

  updateServices(id: any, updateServicesRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.baseApi}/Services/EditServices/${id}`, updateServicesRequest);
  }

  deleteServices(id: any): Observable<any>{
    return this.http.delete<any>(`${environment.baseApi}/Services/DeleteServices?id=${id}`);
  } 
}
