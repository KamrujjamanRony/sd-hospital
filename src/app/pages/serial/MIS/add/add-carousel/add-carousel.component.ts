import { Component, OnDestroy, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../../../components/main/shared/all-modals/confirm-modal/confirm-modal.component';
import { CarouselService } from '../../../../../services/main/carousel.service';
import { ImgbbService } from '../../../../../services/main/imgbb.service';
import { environment } from '../../../../../../environments/environments';

@Component({
  selector: 'app-add-carousel',
  templateUrl: './add-carousel.component.html',
  imports: [CoverComponent, FormsModule, ConfirmModalComponent]
})
export class AddCarouselComponent implements OnDestroy {
  carouselService = inject(CarouselService);
  imgbbService = inject(ImgbbService);

  model: any;
  private addCarouselSubscription?: Subscription;
  confirmModal = signal<boolean>(false);

  closeModal() {
    this.confirmModal.set(false);
  }

  constructor() {
    this.model = {
      companyID: environment.hospitalCode,
      title: '',
      description: '',
      imageUrl: '',
    };
  }

  onFormSubmit(): void {
    const formData = new FormData();

    formData.append('CompanyID', this.model().companyID);
    formData.append('Title', this.model().title);
    formData.append('Description', this.model().description);
    formData.append('ImageUrl', this.model().imageUrl);

    this.addCarouselSubscription = this.carouselService.addCarousel(formData)
      .subscribe({
        next: (response) => {
          this.confirmModal.set(true);
        },
        error: (error) => {
          console.error('Error adding carousel:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.addCarouselSubscription?.unsubscribe();
  }
}
