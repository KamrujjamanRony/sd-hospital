import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable, Subscription, map } from 'rxjs';
import { CoverComponent } from '../../../shared/cover/cover.component';
import { environment } from '../../../../../environments/environments';
import { HospitalNewsService } from '../../../../features/services/hospitalNews.service';
import { DeleteConfirmationModalComponent } from '../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-hospital-news-list',
  standalone: true,
  imports: [CommonModule, CoverComponent, RouterLink, MatDialogModule],
  templateUrl: './hospital-news-list.component.html',
  styleUrl: './hospital-news-list.component.css'
})
export class HospitalNewsListComponent {
  yourTitle: any = 'all Hospital News information';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Hospital News';
  emptyImg: any = environment.emptyImg;
  hospitalNews$?: Observable<any[]>;
  deleteHospitalNewsSubscription?: Subscription;
  isModalOpen = false;
  constructor(private HospitalNewsService: HospitalNewsService, private dialog: MatDialog) { 
    if (!this.hospitalNews$) {
      this.hospitalNews$ = HospitalNewsService.getCompanyHospitalNews().pipe(
        map(doctors => doctors.sort((a, b) => a.newsSerial - b.newsSerial))
      );
    }
  }

  ngOnInit(): void {
    // this.hospitalNews$ = this.HospitalNewsService.getCompanyHospitalNews(this.companyID);

    // this.hospitalNews$.subscribe(() => {
    //   this.loading = false;
    // });
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
    this.deleteHospitalNewsSubscription = this.HospitalNewsService.deleteHospitalNews(id).subscribe({
      next: () => {
        this.hospitalNews$ = this.HospitalNewsService.getCompanyHospitalNews();
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
