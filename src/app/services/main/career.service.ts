import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  http = inject(HttpClient);

  constructor() {}

  addCareer(model: any | FormData): Observable<void>{
    return this.http.post<void>(`${environment.baseApi}/Carousel`, model)
  }

  getAllCareer(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseApi}/Carousel`);
  }

  getCompanyCareer(): Observable<any[]> {
    return this.getAllCareer().pipe(
      map(Career => Career.filter(a => a.companyID === 20))   // TODO: environment.hospitalCode
    );
  }

  getCareer(id: any): Observable<any>{
    return this.http.get<any>(`${environment.baseApi}/Carousel/GetCarouselById?id=${id}`);
  }

  updateCareer(id: any, updateCareerRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.baseApi}/Carousel/EditCarousel/${id}`, updateCareerRequest);
  }

  deleteCareer(id: any): Observable<any>{
    return this.http.delete<any>(`${environment.baseApi}/Carousel/DeleteCarousel?id=${id}`);
  }
}
