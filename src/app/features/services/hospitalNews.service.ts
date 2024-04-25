import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HospitalNewsService {

  constructor(private http: HttpClient) { }

  addHospitalNews(model: any | FormData): Observable<void>{
    return this.http.post<void>(`${environment.baseApi}/HospitalNews`, model)
  }

  getAllHospitalNews(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseApi}/HospitalNews`);
  }

  getCompanyHospitalNews(): Observable<any[]> {
    return this.getAllHospitalNews().pipe(
      map(HospitalNews => HospitalNews.filter(a => a.companyID === environment.hospitalCode))
    );
  }

  getHospitalNews(id: any): Observable<any>{
    return this.http.get<any>(`${environment.baseApi}/HospitalNews/GetHospitalNewsById?id=${id}`);
  }

  updateHospitalNews(id: any, updateHospitalNewsRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.baseApi}/HospitalNews/EditHospitalNews/${id}`, updateHospitalNewsRequest);
  }

  deleteHospitalNews(id: any): Observable<any>{
    return this.http.delete<any>(`${environment.baseApi}/HospitalNews/DeleteHospitalNews?id=${id}`);
  } 
}
