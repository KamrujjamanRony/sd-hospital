import { Component, inject } from '@angular/core';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../../../../components/main/shared/all-modals/confirm-modal/confirm-modal.component';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../../environments/environments';
import { ServicesService } from '../../../../../services/main/services.service';

@Component({
    selector: 'app-add-services',
    imports: [CoverComponent, FormsModule, ConfirmModalComponent],
    templateUrl: './add-services.component.html',
    styleUrl: './add-services.component.css'
})
export class AddServicesComponent {
  servicesService = inject(ServicesService);
  
  model: any;
  services: any;
  private addInstrumentSubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor() {
    if (!this.services) {
      this.servicesService.getCompanyServices().subscribe(data => {
        this.services = data;
      });
    }
    this.model = {
      companyID: environment.hospitalCode,
      title: "",
      description: "",
      imageUrl: "",
    };
  }

  onFormSubmit(): void {
    const formData = new FormData();

    formData.append('CompanyID', this.model.companyID);
    formData.append('Title', this.model.title);
    formData.append('Description', this.model.description);
    formData.append('ImageUrl', this.model.imageUrl);

    this.addInstrumentSubscription = this.servicesService.addServices(formData)
      .subscribe({
        next: (response) => {
          this.confirmModal = true;
        },
        error: (error) => {
          console.error('Error adding Service:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.addInstrumentSubscription?.unsubscribe();
  }

}
