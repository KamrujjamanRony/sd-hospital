import { Component, inject, signal } from '@angular/core';
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
  news = signal<any[]>([]);
  latestNews = signal<any[]>([]);

  ngOnInit(): void {
    this.hospitalNewsService.getCompanyHospitalNews().subscribe(data => {
      this.latestNews.set(data);
      this.news.set(data.sort((a: { healthNewsSerial: number; }, b: { healthNewsSerial: number; }) => a.healthNewsSerial - b.healthNewsSerial));
    })
  }

}
