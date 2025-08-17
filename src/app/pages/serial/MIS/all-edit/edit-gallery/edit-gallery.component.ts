import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../../../components/main/shared/all-modals/confirm-modal/confirm-modal.component';
import { GalleryService } from '../../../../../services/main/gallery.service';
import { ImgbbService } from '../../../../../services/main/imgbb.service';

@Component({
  selector: 'app-edit-gallery',
  imports: [CoverComponent, FormsModule, ConfirmModalComponent],
  templateUrl: './edit-gallery.component.html',
  styleUrl: './edit-gallery.component.css'
})
export class EditGalleryComponent {
  imgbbService = inject(ImgbbService);
  galleryService = inject(GalleryService);
  route = inject(ActivatedRoute);
  paramsSubscription?: Subscription;
  editGallerySubscription?: Subscription;

  id = signal<any>(null);
  model = signal<any>(null);
  confirmModal = signal<boolean>(false);

  closeModal() {
    this.confirmModal.set(false);
  }

  constructor() { }
  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id.set(params.get('id'));
        if (this.id()) {
          this.galleryService.getGallery(this.id())
            .subscribe({
              next: (response) => {
                this.model.set(response);
              }
            });
        }
      }
    });
  }

  onFormSubmit(): void {

    const formData = new FormData();

    formData.append('CompanyID', this.model().companyID);
    formData.append('GalerySerial', this.model().galerySerial);
    formData.append('GaleryName', this.model().galeryName);
    formData.append('Description', this.model().description);
    formData.append('GPicUrl', this.model().gPicUrl);

    if (this.id()) {
      this.editGallerySubscription = this.galleryService.updateGallery(this.id(), formData)
        .subscribe({
          next: (response) => {
            this.confirmModal.set(true);
          }
        });
    }
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editGallerySubscription?.unsubscribe();
  }

}
