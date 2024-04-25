import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  constructor(private http: HttpClient) {}

  // addAbout(model: any | FormData): Observable<void>{
  //   return this.http.post<void>(`${environment.baseApi}/AboutUs`, model)
  // }

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

  // deleteAbout(id: any): Observable<any>{
  //   return this.http.delete<any>(`${environment.baseApi}/AboutUs/DeleteAboutUs?id=${id}`);
  // }

  
  
}
