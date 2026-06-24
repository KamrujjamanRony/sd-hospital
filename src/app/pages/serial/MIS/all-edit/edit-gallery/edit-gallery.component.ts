import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { AppStore } from '../../../../../store/app.store';

@Component({
  selector: 'app-edit-gallery',
  imports: [CoverComponent, FormsModule],
  templateUrl: './edit-gallery.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './edit-gallery.component.css'
})
export class EditGalleryComponent {
  store = inject(AppStore);
  router = inject(Router);
  route = inject(ActivatedRoute);
  paramsSubscription?: Subscription;
  id = signal<any>(null);
  model = signal<any>(null);

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id.set(params.get('id'));
        if (this.id()) {
          this.model.set(this.store.getGalleryById(this.id()));
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
      // Use store to update Gallery - automatically updates global state
      this.store.updateGallery({ id: this.id(), data: formData });
      this.router.navigate(['/serial/admin/all-mis/gallery-list']);
    }
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
  }

}
