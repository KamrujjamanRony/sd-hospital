import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../../../services/serial/auth.service';
import { environment } from '../../../../../../environments/environments';
import { Observable, Subscription } from 'rxjs';
import { CarouselService } from '../../../../../services/main/carousel.service';
import { DeleteConfirmationModalComponent } from '../../../../../components/main/shared/all-modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';



@Component({
  selector: 'app-career-list',
  standalone: true,
  imports: [CommonModule, CoverComponent, RouterLink, MatDialogModule],
  templateUrl: './career-list.component.html',
  styleUrl: './career-list.component.css'
})
export class CareerListComponent {
  authService = inject(AuthService);
  carouselService = inject(CarouselService);
  router = inject(Router);
  dialog = inject(MatDialog);
  user: any;
  emptyImg: any = environment.emptyImg;
  loading: boolean = true;
  carousels$?: Observable<any[]>;
  deleteCarouselSubscription?: Subscription;
  companyID: any = environment.hospitalCode;
  isModalOpen = false;
  constructor() { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    
    if (!this.carousels$) {
      this.loading = false;
      this.carousels$ = this.carouselService.getCompanyCarousel();
    }
  }

  checkRoles(roleId: any) {
    const result = this.user?.roleIds?.find((role: any) => role == roleId)
    return result;
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
    this.deleteCarouselSubscription = this.carouselService.deleteCarousel(id).subscribe({
      next: () => {
        this.carousels$ = this.carouselService.getCompanyCarousel();
        this.closeModal();
      },
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  ngOnDestroy(): void {
    this.deleteCarouselSubscription?.unsubscribe();
  }

}
