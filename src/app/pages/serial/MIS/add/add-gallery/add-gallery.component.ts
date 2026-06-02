import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { environment } from '../../../../../../environments/environments';
import { AppStore } from '../../../../../store/app.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-gallery',
  imports: [CoverComponent, FormsModule],
  templateUrl: './add-gallery.component.html',
  styleUrl: './add-gallery.component.css'
})
export class AddGalleryComponent {
  private store = inject(AppStore);
  router = inject(Router);
  model = signal<any>(null);
  loading = this.store.loading;

  constructor() {
    this.model.set({
      companyID: environment.hospitalCode,
      galerySerial: null,
      galeryName: "",
      description: "",
      gPicUrl: "",
    });
  }

  onFormSubmit(): void {
    const formData = new FormData();

    formData.append('CompanyID', this.model().companyID);
    formData.append('GalerySerial', this.model().galerySerial);
    formData.append('GaleryName', this.model().galeryName);
    formData.append('Description', this.model().description);
    formData.append('GPicUrl', this.model().gPicUrl);
    // Use store to add Gallery - automatically updates global state
    this.store.addGallery(formData);
    this.router.navigate(['/serial/admin/all-mis/gallery-list']);
  }

}
