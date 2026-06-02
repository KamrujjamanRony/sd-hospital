import { Component, inject, signal } from '@angular/core';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStore } from '../../../../../store/app.store';

@Component({
  selector: 'app-edit-services',
  imports: [CoverComponent, FormsModule],
  templateUrl: './edit-services.component.html',
  styleUrl: './edit-services.component.css'
})
export class EditServicesComponent {
  store = inject(AppStore);
  route = inject(ActivatedRoute);
  router = inject(Router);
  paramsSubscription?: Subscription;

  id = signal<any>(null);
  model = signal<any>(null);
  services = this.store.services;

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id.set(params.get('id'));
        if (this.id()) {
          this.model.set(this.store.getServiceById(this.id()));
        }
      }
    });
  }

  onFormSubmit(): void {
    const formData = new FormData();
    formData.append('CompanyID', this.model().companyID);
    formData.append('Title', this.model().title);
    formData.append('Description', this.model().description || "");
    formData.append('ImageUrl', this.model().imageUrl);

    if (this.id()) {
      // Use store to update Service - automatically updates global state
      this.store.updateService({ id: this.id(), data: formData });
      this.router.navigate(['/serial/admin/all-mis/service-list']);
    }
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
  }

}
