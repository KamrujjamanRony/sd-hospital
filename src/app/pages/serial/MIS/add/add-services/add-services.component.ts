import { Component } from '@angular/core';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../../../../components/main/shared/all-modals/confirm-modal/confirm-modal.component';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../../environments/environments';
import { ServicesService } from '../../../../../services/main/services.service';

@Component({
  selector: 'app-add-services',
  standalone: true,
  imports: [CoverComponent, FormsModule, ConfirmModalComponent],
  templateUrl: './add-services.component.html',
  styleUrl: './add-services.component.css'
})
export class AddServicesComponent {
  // Component properties
  yourTitle: any = 'Add a Service';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Services';
  model: any;
  services: any;
  private addInstrumentSubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor(private ServicesService: ServicesService) {
    if (!this.services) {
      ServicesService.getCompanyServices().subscribe(data => {
        this.services = data;
      });
    }
    // Initialize model properties
    this.model = {
      companyID: environment.hospitalCode,
      title: "",
      description: "",
      imageUrl: "",
    };
  }

  // Handle form submission
  onFormSubmit(): void {
    const formData = new FormData();

    formData.append('CompanyID', this.model.companyID);
    formData.append('Title', this.model.title);
    formData.append('Description', this.model.description);
    formData.append('ImageUrl', this.model.imageUrl);

    this.addInstrumentSubscription = this.ServicesService.addServices(formData)
      .subscribe({
        next: (response) => {
          // toast
          this.confirmModal = true;
        },
        error: (error) => {
          console.error('Error adding Service:', error);
        }
      });
  }

  // Unsubscribe from the subscription to avoid memory leaks
  ngOnDestroy(): void {
    this.addInstrumentSubscription?.unsubscribe();
  }

}
