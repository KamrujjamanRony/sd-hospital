import { Observable, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { environment } from '../../../../../../environments/environments';
import { CarouselService } from '../../../../../services/main/carousel.service';
import { DeleteConfirmationModalComponent } from '../../../../../components/main/shared/all-modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { AuthService } from '../../../../../services/serial/auth.service';

@Component({
    selector: 'app-carousel-list',
    templateUrl: './carousel-list.component.html',
    imports: [CommonModule, CoverComponent, RouterLink, DeleteConfirmationModalComponent]
})
export class CarouselListComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  carouselService = inject(CarouselService);
  router = inject(Router);
  
  user: any;
  emptyImg: any = environment.emptyImg;
  loading: boolean = true;
  carousels$?: Observable<any[]>;
  deleteCarouselSubscription?: Subscription;
  companyID: any = environment.hospitalCode;
  isConfirmOpen = false;
  idToDelete: any;

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
    this.idToDelete = id;
    this.isConfirmOpen = true;
  }

  confirmDelete(): void {
    this.deleteCarouselSubscription = this.carouselService.deleteCarousel(this.idToDelete).subscribe({
      next: () => {
        this.carousels$ = this.carouselService.getCompanyCarousel();
        this.closeModal();
      },
    });
  }

  closeModal(): void {
    this.isConfirmOpen = false;
  }

  ngOnDestroy(): void {
    this.deleteCarouselSubscription?.unsubscribe();
  }
}
