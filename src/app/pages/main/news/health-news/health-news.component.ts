import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HealthNewsService } from '../../../../services/main/healthNews.service';
import { NewsCardComponent } from "../../../../components/main/shared/all-cards/news-card/news-card.component";

@Component({
  selector: 'app-health-news',
  templateUrl: './health-news.component.html',
  styleUrl: './health-news.component.css',
  imports: [NewsCardComponent]
})
export class HealthNewsComponent {
  healthNewsService = inject(HealthNewsService);

  news$?: Observable<any[]>;
  news?: any;
  latestNews?: any;

  constructor() { }

  ngOnInit(): void {
    this.news$ = this.healthNewsService.getCompanyHealthNews();
    this.news$.subscribe(data => {
      this.latestNews = data;
    })
    this.news$.subscribe(data => {
      this.news = data.sort((a: { healthNewsSerial: number; }, b: { healthNewsSerial: number; }) => a.healthNewsSerial - b.healthNewsSerial);
    })
  }

}
