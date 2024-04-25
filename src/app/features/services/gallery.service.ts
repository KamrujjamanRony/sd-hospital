import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor(private http: HttpClient) { }

  addGallery(model: any | FormData): Observable<void>{
    return this.http.post<void>(`${environment.baseApi}/Galery`, model)
  }

  getAllGallery(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseApi}/Galery`);
  }

  getCompanyGallery(): Observable<any[]> {
    return this.getAllGallery().pipe(
      map(Gallery => Gallery.filter(a => a.companyID === environment.hospitalCode))
    );
  }

  getGallery(id: any): Observable<any>{
    return this.http.get<any>(`${environment.baseApi}/Galery/GetGaleryById?id=${id}`);
  }

  updateGallery(id: any, updateGalleryRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.baseApi}/Galery/EditGalery/${id}`, updateGalleryRequest);
  }

  deleteGallery(id: any): Observable<any>{
    return this.http.delete<any>(`${environment.baseApi}/Galery/DeleteGalery?id=${id}`);
  } 
}
