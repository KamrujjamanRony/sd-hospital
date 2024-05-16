import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class InstrumentService {

  constructor(private http: HttpClient) { }

  addInstrument(model: any | FormData): Observable<void>{
    return this.http.post<void>(`${environment.baseApi}/Instrument`, model)
  }

  getAllInstrument(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseApi}/Instrument`);
  }

  getCompanyInstrument(): Observable<any[]> {
    return this.getAllInstrument().pipe(
      map(Instrument => Instrument.filter(a => a.companyID === environment.hospitalCode))
    );
  }

  getInstrument(id: any): Observable<any>{
    return this.http.get<any>(`${environment.baseApi}/Instrument/GetInstrumentById?id=${id}`);
  }

  updateInstrument(id: any, updateInstrumentRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.baseApi}/Instrument/EditInstrument/${id}`, updateInstrumentRequest);
  }

  deleteInstrument(id: any): Observable<any>{
    return this.http.delete<any>(`${environment.baseApi}/Instrument/DeleteInstrument?id=${id}`);
  } 
}
