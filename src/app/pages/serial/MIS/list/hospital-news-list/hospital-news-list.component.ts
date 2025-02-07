import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subscription, map } from 'rxjs';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { environment } from '../../../../../../environments/environments';
import { HospitalNewsService } from '../../../../../services/main/hospitalNews.service';
import { DeleteConfirmationModalComponent } from '../../../../../components/main/shared/all-modals/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
    selector: 'app-hospital-news-list',
    imports: [CommonModule, CoverComponent, RouterLink, DeleteConfirmationModalComponent],
    templateUrl: './hospital-news-list.component.html',
    styleUrl: './hospital-news-list.component.css'
})
export class HospitalNewsListComponent {
  hospitalNewsService = inject(HospitalNewsService);

  emptyImg: any = environment.emptyImg;
  hospitalNews$?: Observable<any[]>;
  deleteHospitalNewsSubscription?: Subscription;
  isConfirmOpen = false;
  idToDelete: any;
  
  constructor() { }

  ngOnInit(): void {
    if (!this.hospitalNews$) {
      this.hospitalNews$ = this.hospitalNewsService.getCompanyHospitalNews().pipe(
        map(doctors => doctors.sort((a, b) => a.newsSerial - b.newsSerial))
      );
    }
  }
  
  onDelete(id: any): void {
    this.idToDelete = id;
    this.isConfirmOpen = true;
  }

  confirmDelete(): void {
    this.deleteHospitalNewsSubscription = this.hospitalNewsService.deleteHospitalNews(this.idToDelete).subscribe({
      next: () => {
        this.hospitalNews$ = this.hospitalNewsService.getCompanyHospitalNews();
        this.closeModal();
      },
    });
  }

  closeModal(): void {
    this.isConfirmOpen = false;
  }

  ngOnDestroy(): void {
    this.deleteHospitalNewsSubscription?.unsubscribe();
  }

}
