import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HealthNewsService {

  constructor(private http: HttpClient) { }

  addHealthNews(model: any | FormData): Observable<void>{
    return this.http.post<void>(`${environment.baseApi}/HealthNews`, model)
  }

  getAllHealthNews(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseApi}/HealthNews`);
  }

  getCompanyHealthNews(): Observable<any[]> {
    return this.getAllHealthNews().pipe(
      map(HealthNews => HealthNews.filter(a => a.companyID === environment.hospitalCode))
    );
  }

  getHealthNews(id: any): Observable<any>{
    return this.http.get<any>(`${environment.baseApi}/HealthNews/GetHealthNewsById?id=${id}`);
  }

  updateHealthNews(id: any, updateHealthNewsRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.baseApi}/HealthNews/EditHealthNews/${id}`, updateHealthNewsRequest);
  }

  deleteHealthNews(id: any): Observable<any>{
    return this.http.delete<any>(`${environment.baseApi}/HealthNews/DeleteHealthNews?id=${id}`);
  } 
}
