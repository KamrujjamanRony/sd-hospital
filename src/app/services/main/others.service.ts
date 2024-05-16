import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class OthersService {

  constructor(private http: HttpClient) { }

  addOthers(model: any | FormData): Observable<void>{
    return this.http.post<void>(`${environment.baseApi}/Others`, model)
  }

  getAllOthers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseApi}/Others`);
  }

  getCompanyOthers(companyID: any): Observable<any[]> {
    return this.getAllOthers().pipe(
      map(Others => Others.filter(a => a.companyID === companyID))
    );
  }

  getOthers(id: any): Observable<any>{
    // return this.http.get<any>(`${environment.baseApi}/Others/GetOthersById?id=${id}`);
    return this.http.get<any>(`${environment.baseApi}/Others?id=${id}`);
  }

//   updateOthers(id: any, updateOthersRequest: any | FormData): Observable<any>{
//     return this.http.put<any>(`${environment.baseApi}/Others/EditOthers/${id}`, updateOthersRequest);
//   }

//   deleteOthers(id: any): Observable<any>{
//     return this.http.delete<any>(`${environment.baseApi}/Others/DeleteOthers?id=${id}`);
//   } 
}
