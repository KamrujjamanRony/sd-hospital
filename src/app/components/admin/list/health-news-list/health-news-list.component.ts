import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable, Subscription, map } from 'rxjs';
import { CoverComponent } from '../../../shared/cover/cover.component';
import { environment } from '../../../../../environments/environments';
import { HealthNewsService } from '../../../../features/services/healthNews.service';
import { DeleteConfirmationModalComponent } from '../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-health-news-list',
  standalone: true,
  imports: [CommonModule, CoverComponent, RouterLink, MatDialogModule],
  templateUrl: './health-news-list.component.html',
  styleUrl: './health-news-list.component.css'
})
export class HealthNewsListComponent {
  yourTitle: any = 'all HealthNews information';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'HealthNews';
  emptyImg: any = environment.emptyImg;
  loading: boolean = true;
  healthNews$?: Observable<any[]>;
  deleteHealthNewsSubscription?: Subscription;
  isModalOpen = false;
  constructor(private healthNewsService: HealthNewsService, private dialog: MatDialog) { 
    if (!this.healthNews$) {
      this.loading = false;
      this.healthNews$ = healthNewsService.getCompanyHealthNews().pipe(
        map(doctors => doctors.sort((a, b) => a.healthNewsSerial - b.healthNewsSerial))
      );
    }
  }

  ngOnInit(): void {
    // this.healthNews$ = this.healthNewsService.getCompanyHealthNews(this.companyID);

    // this.healthNews$.subscribe(() => {
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
    this.deleteHealthNewsSubscription = this.healthNewsService.deleteHealthNews(id).subscribe({
      next: () => {
        this.healthNews$ = this.healthNewsService.getCompanyHealthNews();
        this.closeModal();
      },
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  ngOnDestroy(): void {
    this.deleteHealthNewsSubscription?.unsubscribe();
  }

}
