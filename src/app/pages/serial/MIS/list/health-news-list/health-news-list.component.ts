import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subscription, map } from 'rxjs';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { environment } from '../../../../../../environments/environments';
import { HealthNewsService } from '../../../../../services/main/healthNews.service';
import { DeleteConfirmationModalComponent } from '../../../../../components/main/shared/all-modals/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
    selector: 'app-health-news-list',
    imports: [CommonModule, CoverComponent, RouterLink, DeleteConfirmationModalComponent],
    templateUrl: './health-news-list.component.html',
    styleUrl: './health-news-list.component.css'
})
export class HealthNewsListComponent {
  healthNewsService = inject(HealthNewsService);

  emptyImg: any = environment.emptyImg;
  loading: boolean = true;
  healthNews$?: Observable<any[]>;
  deleteHealthNewsSubscription?: Subscription;
  isConfirmOpen = false;
  idToDelete: any;
  
  constructor() { }

  ngOnInit(): void {
    if (!this.healthNews$) {
      this.loading = false;
      this.healthNews$ = this.healthNewsService.getCompanyHealthNews().pipe(
        map(doctors => doctors.sort((a, b) => a.healthNewsSerial - b.healthNewsSerial))
      );
    }
  }
  
  onDelete(id: any): void {
    this.idToDelete = id;
    this.isConfirmOpen = true;
  }

  confirmDelete(): void {
    this.deleteHealthNewsSubscription = this.healthNewsService.deleteHealthNews(this.idToDelete).subscribe({
      next: () => {
        this.healthNews$ = this.healthNewsService.getCompanyHealthNews();
        this.closeModal();
      },
    });
  }

  closeModal(): void {
    this.isConfirmOpen = false;
  }

  ngOnDestroy(): void {
    this.deleteHealthNewsSubscription?.unsubscribe();
  }

}
