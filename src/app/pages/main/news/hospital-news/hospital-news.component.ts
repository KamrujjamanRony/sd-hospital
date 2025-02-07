import { Component, inject } from '@angular/core';
import { NewsCardComponent } from "../../../../components/main/shared/all-cards/news-card/news-card.component";
import { Observable } from 'rxjs';
import { HospitalNewsService } from '../../../../services/main/hospitalNews.service';

@Component({
  selector: 'app-hospital-news',
  templateUrl: './hospital-news.component.html',
  styleUrl: './hospital-news.component.css',
  imports: [NewsCardComponent]
})
export class HospitalNewsComponent {
  hospitalNewsService = inject(HospitalNewsService);
  news$?: Observable<any[]>;
  news?: any;
  latestNews?: any;

  constructor() { }

  ngOnInit(): void {
    this.news$ = this.hospitalNewsService.getCompanyHospitalNews();
    this.news$.subscribe(data => {
      this.latestNews = data;
    })
    this.news$.subscribe(data => {
      this.news = data.sort((a: { healthNewsSerial: number; }, b: { healthNewsSerial: number; }) => a.healthNewsSerial - b.healthNewsSerial);
    })
  }

}
