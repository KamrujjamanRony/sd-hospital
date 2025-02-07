import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../../../components/main/shared/all-modals/confirm-modal/confirm-modal.component';
import { CarouselService } from '../../../../../services/main/carousel.service';
import { ImgbbService } from '../../../../../services/main/imgbb.service';

@Component({
    selector: 'app-edit-carousel',
    templateUrl: './edit-carousel.component.html',
    imports: [CoverComponent, FormsModule, ConfirmModalComponent]
})
export class EditCarouselComponent implements OnInit, OnDestroy {
  carouselService = inject(CarouselService);
  route = inject(ActivatedRoute);
  imgbbService = inject(ImgbbService);
  
  id: any = null;
  carouselInfo?: any;
  paramsSubscription?: Subscription;
  editCarouselSubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor() { }

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
          next: () => {
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
