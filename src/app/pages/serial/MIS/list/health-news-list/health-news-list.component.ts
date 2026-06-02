import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { environment } from '../../../../../../environments/environments';
import { AppStore } from '../../../../../store/app.store';

@Component({
  selector: 'app-health-news-list',
  imports: [CoverComponent, RouterLink],
  templateUrl: './health-news-list.component.html',
  styleUrl: './health-news-list.component.css'
})
export class HealthNewsListComponent {
  store = inject(AppStore);
  emptyImg: any = environment.emptyImg;
  healthNews = this.store.healthNews;

  onDelete(id: any): void {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.store.deleteHealthNews(id);
    }
  }

}
