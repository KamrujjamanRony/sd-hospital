import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Address } from '../../store/app.store';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  http = inject(HttpClient);

  constructor() { }

  getAllAddress(): Observable<Address[]> {
    return this.http.get<any[]>(`${environment.ContactApi}`);
  }

  getCompanyAddress(): Observable<Address> {
    return this.getAllAddress().pipe(
      map(addresses => {
        const address = addresses.find(a => a.companyID == environment.hospitalCode);
        if (!address) {
          throw new Error('Company address not found');
        }
        return address;
      })
    );
  }

  getAddress(id: any): Observable<Address> {
    return this.http.get<any>(`${environment.ContactApi}/GetAddressById?id=${id}`);
  }

  updateAddress(id: any, updateAddressRequest: any | FormData): Observable<any> {
    return this.http.put<any>(`${environment.ContactApi}/EditAddress/${id}`, updateAddressRequest);
  }

  // deleteAddress(id: any): Observable<Address>{
  //   return this.http.delete<any>(`${environment.baseApi}/Address/DeleteAddress?id=${id}`);
  // }
}
