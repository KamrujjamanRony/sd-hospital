import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) {}

  
  // addAddress(model: any | FormData): Observable<void>{
  //   return this.http.post<void>(`${environment.baseApi}/Address`, model)
  // }

  getAllAddress(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseApi}/Address`);
  }

  getCompanyAddress(): Observable<any[]> {
    return this.getAllAddress().pipe(
      map(address => address.find(a => a.companyID === environment.hospitalCode))
    );
  }

  getAddress(id: any): Observable<any>{
    return this.http.get<any>(`${environment.baseApi}/Address/GetAddressById?id=${id}`);
  }

  updateAddress(id: any, updateAddressRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.baseApi}/Address/EditAddress/${id}`, updateAddressRequest);
  }

  // deleteAddress(id: any): Observable<any>{
  //   return this.http.delete<any>(`${environment.baseApi}/Address/DeleteAddress?id=${id}`);
  // }
}
