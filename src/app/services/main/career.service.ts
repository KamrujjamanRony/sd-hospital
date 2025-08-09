import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  http = inject(HttpClient);

  constructor() { }

  addCareer(model: any | FormData): Observable<void> {
    return this.http.post<void>(`${environment.baseApi}/Career`, model)
  }

  getAllCareer(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseApi}/Career`);
  }

  getCompanyCareer(): Observable<any[]> {
    return this.getAllCareer().pipe(
      map(Career => Career.filter(a => a.companyID === environment.hospitalCode))
    );
  }

  getCareer(id: any): Observable<any> {
    return this.http.get<any>(`${environment.baseApi}/Career/GetCareerById?id=${id}`);
  }

  updateCareer(id: any, updateCareerRequest: any | FormData): Observable<any> {
    return this.http.put<any>(`${environment.baseApi}/Career/EditCareer/${id}`, updateCareerRequest);
  }

  deleteCareer(id: any): Observable<any> {
    return this.http.delete<any>(`${environment.baseApi}/Career/DeleteCareer?id=${id}`);
  }
}
