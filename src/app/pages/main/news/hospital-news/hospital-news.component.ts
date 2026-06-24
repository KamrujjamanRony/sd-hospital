import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { NewsCardComponent } from "../../../../components/main/shared/all-cards/news-card/news-card.component";
import { HospitalNewsService } from '../../../../services/main/hospitalNews.service';
import { HomeCover } from "../../../../components/main/home/home-cover/home-cover";
import { AppStore } from '../../../../store/app.store';

@Component({
  selector: 'app-hospital-news',
  templateUrl: './hospital-news.component.html',
  styleUrl: './hospital-news.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NewsCardComponent, HomeCover]
})
export class HospitalNewsComponent {
  private store = inject(AppStore);
  latestNews = this.store.hospitalNews;
  hospitalNews = this.latestNews().sort((a, b) => a.newsSerial - b.newsSerial);

}
