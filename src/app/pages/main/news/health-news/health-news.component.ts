import { Component, inject, signal } from '@angular/core';
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
  news = signal<any[]>([]);
  latestNews = signal<any[]>([]);

  constructor() { }

  ngOnInit(): void {
    this.healthNewsService.getCompanyHealthNews().subscribe(data => {
      this.latestNews.set(data);
      this.news?.set(data.sort((a: { healthNewsSerial: number; }, b: { healthNewsSerial: number; }) => a.healthNewsSerial - b.healthNewsSerial));
    });
  }

}
