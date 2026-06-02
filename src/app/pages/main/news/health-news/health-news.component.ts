import { Component, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HealthNewsService } from '../../../../services/main/healthNews.service';
import { NewsCardComponent } from "../../../../components/main/shared/all-cards/news-card/news-card.component";
import { HomeCover } from "../../../../components/main/home/home-cover/home-cover";
import { AppStore } from '../../../../store/app.store';

@Component({
  selector: 'app-health-news',
  templateUrl: './health-news.component.html',
  styleUrl: './health-news.component.css',
  imports: [NewsCardComponent, HomeCover]
})
export class HealthNewsComponent {
  private store = inject(AppStore);
  latestNews = this.store.healthNews;
  healthNews = this.latestNews().sort((a, b) => a.healthNewsSerial - b.healthNewsSerial);
}
