import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
  hospitalNews$?: Observable<any[]>;
  deleteHospitalNewsSubscription?: Subscription;
  emptyImg: any = environment.emptyImg;

  isConfirmOpen = signal<boolean>(false);
  idToDelete = signal<any>(null);

  constructor() { }

  ngOnInit(): void {
    if (!this.hospitalNews$) {
      this.hospitalNews$ = this.hospitalNewsService.getCompanyHospitalNews().pipe(
        map(doctors => doctors.sort((a, b) => a.newsSerial - b.newsSerial))
      );
    }
  }

  onDelete(id: any): void {
    this.idToDelete.set(id);
    this.isConfirmOpen.set(true);
  }

  confirmDelete(): void {
    this.deleteHospitalNewsSubscription = this.hospitalNewsService.deleteHospitalNews(this.idToDelete()).subscribe({
      next: () => {
        this.hospitalNews$ = this.hospitalNewsService.getCompanyHospitalNews();
        this.closeModal();
      },
    });
  }

  closeModal(): void {
    this.isConfirmOpen.set(false);
  }

  ngOnDestroy(): void {
    this.deleteHospitalNewsSubscription?.unsubscribe();
  }

}
