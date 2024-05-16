import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private jsonUrl = '../../../../assets/data/data.json';
  http = inject(HttpClient);

  constructor() {}

  // Method to fetch JSON data
  getJsonData(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }
}