import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable, Subscription, map } from 'rxjs';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { environment } from '../../../../../../environments/environments';
import { HospitalNewsService } from '../../../../../services/main/hospitalNews.service';
import { DeleteConfirmationModalComponent } from '../../../../../components/main/shared/all-modals/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-hospital-news-list',
  standalone: true,
  imports: [CommonModule, CoverComponent, RouterLink, MatDialogModule],
  templateUrl: './hospital-news-list.component.html',
  styleUrl: './hospital-news-list.component.css'
})
export class HospitalNewsListComponent {
  hospitalNewsService = inject(HospitalNewsService);
  dialog = inject(MatDialog);
  emptyImg: any = environment.emptyImg;
  hospitalNews$?: Observable<any[]>;
  deleteHospitalNewsSubscription?: Subscription;
  isModalOpen = false;
  constructor() { }

  ngOnInit(): void {
    if (!this.hospitalNews$) {
      this.hospitalNews$ = this.hospitalNewsService.getCompanyHospitalNews().pipe(
        map(doctors => doctors.sort((a, b) => a.newsSerial - b.newsSerial))
      );
    }
  }
  
  onDelete(id: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.confirmDelete(id)
      }
    });
  }

  confirmDelete(id: any): void {
    this.deleteHospitalNewsSubscription = this.hospitalNewsService.deleteHospitalNews(id).subscribe({
      next: () => {
        this.hospitalNews$ = this.hospitalNewsService.getCompanyHospitalNews();
        this.closeModal();
      },
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  ngOnDestroy(): void {
    this.deleteHospitalNewsSubscription?.unsubscribe();
  }

}
