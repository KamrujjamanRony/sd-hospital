import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  constructor(private http: HttpClient) { }

  addCarousel(model: any | FormData): Observable<void>{
    return this.http.post<void>(`${environment.baseApi}/Carousel`, model)
  }

  getAllCarousel(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseApi}/Carousel`);
  }

  getCompanyCarousel(): Observable<any[]> {
    return this.getAllCarousel().pipe(
      map(carousel => carousel.filter(a => a.companyID === environment.hospitalCode))
    );
  }

  getCarousel(id: any): Observable<any>{
    return this.http.get<any>(`${environment.baseApi}/Carousel/GetCarouselById?id=${id}`);
  }

  updateCarousel(id: any, updateCarouselRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.baseApi}/Carousel/EditCarousel/${id}`, updateCarouselRequest);
  }

  deleteCarousel(id: any): Observable<any>{
    return this.http.delete<any>(`${environment.baseApi}/Carousel/DeleteCarousel?id=${id}`);
  }
}
