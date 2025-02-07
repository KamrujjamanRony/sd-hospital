import { Component, inject } from '@angular/core';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../../../components/main/shared/all-modals/confirm-modal/confirm-modal.component';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ServicesService } from '../../../../../services/main/services.service';

@Component({
    selector: 'app-edit-services',
    imports: [CoverComponent, FormsModule, ConfirmModalComponent],
    templateUrl: './edit-services.component.html',
    styleUrl: './edit-services.component.css'
})
export class EditServicesComponent {
  servicesService = inject(ServicesService);
  route = inject(ActivatedRoute);
  
  id: any = null;
  model?: any;
  services: any;
  paramsSubscription?: Subscription;
  editServicesSubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor() { }

  ngOnInit(): void {
    this.servicesService.getCompanyServices().subscribe(data => {
      this.services = data;
    });
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if (this.id) {
          this.servicesService.getServices(this.id)
            .subscribe({
              next: (response) => {
                this.model = response;
              }
            });
        }
      }
    });
  }

  onFormSubmit(): void {

    const formData = new FormData();

    formData.append('CompanyID', this.model.companyID);
    formData.append('Title', this.model.title);
    formData.append('Description', this.model.description || "");
    formData.append('ImageUrl', this.model.imageUrl);

    if (this.id) {
      this.editServicesSubscription = this.servicesService.updateServices(this.id, formData)
        .subscribe({
          next: (response) => {
            this.confirmModal = true;
          }
        });
    }
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editServicesSubscription?.unsubscribe();
  }

}
