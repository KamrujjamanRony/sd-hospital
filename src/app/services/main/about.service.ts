import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AboutService {
  http = inject(HttpClient);

  constructor() {}

  getAllAbout(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseApi}/AboutUs`);
  }

  getCompanyAbout(): Observable<any[]> {
    return this.getAllAbout().pipe(
      map(about => about.find(a => a.companyID === environment.hospitalCode))
    );
  }

  getAbout(id: any): Observable<any>{
    return this.http.get<any>(`${environment.baseApi}/AboutUs/GetAboutUsById?id=${id}`);
  }

  updateAbout(id: any, updateAboutRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.baseApi}/AboutUs/EditAboutUs/${id}`, updateAboutRequest);
  }
}
