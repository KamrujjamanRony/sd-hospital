import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CoverComponent } from '../../../shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';
import { CarouselService } from '../../../../features/services/carousel.service';
import { ImgbbService } from '../../../../features/services/imgbb.service';

@Component({
  selector: 'app-edit-carousel',
  templateUrl: './edit-carousel.component.html',
  standalone: true,
  imports: [CoverComponent, FormsModule, ConfirmModalComponent]
})
export class EditCarouselComponent implements OnInit, OnDestroy {
  yourTitle: any = 'Update Carousel information';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Edit Carousel';
  id: any = null;
  carouselInfo?: any;
  paramsSubscription?: Subscription;
  editCarouselSubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor(private route: ActivatedRoute, private carouselService: CarouselService, private imgbbService: ImgbbService) { }
  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if (this.id) {
          this.carouselService.getCarousel(this.id)
            .subscribe({
              next: (response) => {
                this.carouselInfo = response;
              }
            });
        }
      }
    });
  }

  onFormSubmit(): void {

    const formData = new FormData();

    formData.append('CompanyID', this.carouselInfo?.companyID);
    formData.append('Title', this.carouselInfo?.title);
    formData.append('Description', this.carouselInfo?.description);
    formData.append('ImageUrl', this.carouselInfo?.imageUrl);

    if (this.id) {
      this.editCarouselSubscription = this.carouselService.updateCarousel(this.id, formData)
        .subscribe({
          next: (response) => {
            // toast
            this.confirmModal = true;
          }
        });
    }
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editCarouselSubscription?.unsubscribe();
  }
}
