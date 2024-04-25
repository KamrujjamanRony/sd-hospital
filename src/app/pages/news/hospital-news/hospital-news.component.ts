import { Component } from '@angular/core';
import { NewsCardComponent } from "../../../components/shared/news-card/news-card.component";
import { Observable } from 'rxjs';
import { HospitalNewsService } from '../../../features/services/hospitalNews.service';
import { CoverComponent } from '../../../components/shared/cover/cover.component';

@Component({
    selector: 'app-hospital-news',
    standalone: true,
    templateUrl: './hospital-news.component.html',
    styleUrl: './hospital-news.component.css',
    imports: [NewsCardComponent, CoverComponent]
})
export class HospitalNewsComponent {
  news$?: Observable<any[]>;
  news?: any;
  latestNews?: any;

  constructor(private HospitalNewsService: HospitalNewsService) { 
    if (!this.news$) {
      this.news$ = HospitalNewsService.getCompanyHospitalNews();
      this.news$.subscribe(data => {
        this.latestNews = data;
      })
      this.news$.subscribe(data => {
        this.news = data.sort((a: { healthNewsSerial: number; }, b: { healthNewsSerial: number; }) => a.healthNewsSerial - b.healthNewsSerial);
      })
    }
  }

}
