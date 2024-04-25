import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CoverComponent } from '../../../shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';
import { GalleryService } from '../../../../features/services/gallery.service';
import { ImgbbService } from '../../../../features/services/imgbb.service';
import { environment } from '../../../../../environments/environments';

@Component({
  selector: 'app-add-gallery',
  standalone: true,
  imports: [CoverComponent, FormsModule, ConfirmModalComponent],
  templateUrl: './add-gallery.component.html',
  styleUrl: './add-gallery.component.css'
})
export class AddGalleryComponent {
  // Component properties
  yourTitle: any = 'add a Gallery';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Add Gallery';
  model: any;
  private addGallerySubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor(private galleryService: GalleryService, private imgbbService: ImgbbService) {
    // Initialize model properties
    this.model = {
      companyID: environment.hospitalCode,
      galerySerial: null,
      galeryName: "",
      description: "",
      gPicUrl: "",
    };
  }

  // Handle form submission
  onFormSubmit(): void {
    const formData = new FormData();

    formData.append('CompanyID', this.model.companyID);
    formData.append('GalerySerial', this.model.galerySerial);
    formData.append('GaleryName', this.model.galeryName);
    formData.append('Description', this.model.description);
    formData.append('GPicUrl', this.model.gPicUrl);

    this.addGallerySubscription = this.galleryService.addGallery(formData)
      .subscribe({
        next: (response) => {
          // toast
          this.confirmModal = true;
        },
        error: (error) => {
          console.error('Error adding Gallery:', error);
        }
      });
  }

  // Unsubscribe from the subscription to avoid memory leaks
  ngOnDestroy(): void {
    this.addGallerySubscription?.unsubscribe();
  }

}
