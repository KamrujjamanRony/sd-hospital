import { Component } from '@angular/core';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../../../components/main/shared/all-modals/confirm-modal/confirm-modal.component';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ServicesService } from '../../../../../services/main/services.service';

@Component({
  selector: 'app-edit-services',
  standalone: true,
  imports: [CoverComponent, FormsModule, ConfirmModalComponent],
  templateUrl: './edit-services.component.html',
  styleUrl: './edit-services.component.css'
})
export class EditServicesComponent {
  yourTitle: any = 'Update Service';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Services';
  id: any = null;
  model?: any;
  services: any;
  paramsSubscription?: Subscription;
  editServicesSubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor(private route: ActivatedRoute, private ServicesService: ServicesService) {
    if (!this.services) {
      ServicesService.getCompanyServices().subscribe(data => {
        this.services = data;
      });
    }
   }
  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if (this.id) {
          this.ServicesService.getServices(this.id)
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
      this.editServicesSubscription = this.ServicesService.updateServices(this.id, formData)
        .subscribe({
          next: (response) => {
            // toast
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
