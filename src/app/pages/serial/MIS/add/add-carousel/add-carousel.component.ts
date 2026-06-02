import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../../../components/main/shared/all-modals/confirm-modal/confirm-modal.component';
import { environment } from '../../../../../../environments/environments';
import { AppStore } from '../../../../../store/app.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-carousel',
  templateUrl: './add-carousel.component.html',
  imports: [CoverComponent, FormsModule, ConfirmModalComponent]
})
export class AddCarouselComponent {
  private store = inject(AppStore);
  router = inject(Router);
  loading = this.store.loading;
  error = this.store.error;

  model = signal<any>(null);
  confirmModal = signal<boolean>(false);

  closeModal() {
    this.confirmModal.set(false);
  }

  constructor() {
    this.model.set({
      companyID: environment.hospitalCode,
      title: '',
      description: '',
      imageUrl: '',
    });
  }

  onFormSubmit(): void {
    const formData = new FormData();
    formData.append('CompanyID', this.model().companyID);
    formData.append('Title', this.model().title);
    formData.append('Description', this.model().description);
    formData.append('ImageUrl', this.model().imageUrl);
    // Use store to add Carousel - automatically updates global state
    this.store.addCarousel(formData);
    this.router.navigate(['/serial/admin/all-mis/carousel']);
  }
}
