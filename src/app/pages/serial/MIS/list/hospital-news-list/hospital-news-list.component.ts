import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { environment } from '../../../../../../environments/environments';
import { AppStore } from '../../../../../store/app.store';

@Component({
  selector: 'app-hospital-news-list',
  imports: [CoverComponent, RouterLink],
  templateUrl: './hospital-news-list.component.html',
  styleUrl: './hospital-news-list.component.css'
})
export class HospitalNewsListComponent {
  store = inject(AppStore);
  hospitalNews = this.store.hospitalNews;
  emptyImg: any = environment.emptyImg;

  onDelete(id: any): void {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.store.deleteHospitalNews(id);
    }
  }

}
