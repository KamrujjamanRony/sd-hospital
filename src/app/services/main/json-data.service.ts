import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JsonDataService {
  private readonly http = inject(HttpClient);
  private readonly jsonUrl = '../../assets/data/header.json';

  // Fetches the JSON data and extracts the header
  getHeader(): Observable<any> {
    return this.http.get<any>(this.jsonUrl).pipe(map(data => data.header));
  }
}
