import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environments';
import { AppStore } from '../../../../../store/app.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-services',
  imports: [CoverComponent, FormsModule],
  templateUrl: './add-services.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './add-services.component.css'
})
export class AddServicesComponent {
  private store = inject(AppStore);
  router = inject(Router);
  loading = this.store.loading;

  model = signal<any>(null);
  services = this.store.services;

  constructor() {
    this.model.set({
      companyID: environment.hospitalCode,
      title: "",
      description: "",
      imageUrl: "",
    });
  }

  onFormSubmit(): void {
    const formData = new FormData();

    formData.append('CompanyID', this.model().companyID);
    formData.append('Title', this.model().title);
    formData.append('Description', this.model().description);
    formData.append('ImageUrl', this.model().imageUrl);
    // Use store to add Service - automatically updates global state
    this.store.addService(formData);
    this.router.navigate(['/serial/admin/all-mis/service-list']);
  }
}