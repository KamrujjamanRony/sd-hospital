import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  http = inject(HttpClient);

  constructor() { }

  addCarousel(model: any | FormData): Observable<void> {
    return this.http.post<void>(`${environment.CarouselApi}`, model)
  }

  getAllCarousel(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.CarouselApi}`);
  }

  getCompanyCarousel(): Observable<any[]> {
    return this.getAllCarousel().pipe(
      map(carousel => carousel.filter(a => a.companyID === environment.hospitalCode))
    );
  }

  getCarousel(id: any): Observable<any> {
    return this.http.get<any>(`${environment.CarouselApi}/GetCarouselById?id=${id}`);
  }

  updateCarousel(id: any, updateCarouselRequest: any | FormData): Observable<any> {
    return this.http.put<any>(`${environment.CarouselApi}/EditCarousel/${id}`, updateCarouselRequest);
  }

  deleteCarousel(id: any): Observable<any> {
    return this.http.delete<any>(`${environment.CarouselApi}/DeleteCarousel?id=${id}`);
  }
}
