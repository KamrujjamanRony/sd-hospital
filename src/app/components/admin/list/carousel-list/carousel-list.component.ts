import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoverComponent } from '../../../shared/cover/cover.component';
import { environment } from '../../../../../environments/environments';
import { CarouselService } from '../../../../features/services/main/carousel.service';
import { DeleteConfirmationModalComponent } from '../../../shared/modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { AuthService } from '../../../../features/services/serial/auth.service';

@Component({
  selector: 'app-carousel-list',
  templateUrl: './carousel-list.component.html',
  standalone: true,
  imports: [CommonModule, CoverComponent, RouterLink, MatDialogModule]
})
export class CarouselListComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  user: any;
  yourTitle: any = 'all carousel information';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Carousel';
  emptyImg: any = environment.emptyImg;
  loading: boolean = true;
  carousels$?: Observable<any[]>;
  deleteCarouselSubscription?: Subscription;
  companyID: any = environment.hospitalCode;
  isModalOpen = false;
  constructor(private carouselService: CarouselService, private router: Router, private dialog: MatDialog) { 
    if (!this.carousels$) {
      this.loading = false;
      this.carousels$ = carouselService.getCompanyCarousel();
    }
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    // this.carousels$ = this.carouselService.getCompanyCarousel(this.companyID);

    // this.carousels$.subscribe(() => {
    //   this.loading = false;
    // });
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
