import { Component, inject } from '@angular/core';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../../../../components/main/shared/all-modals/confirm-modal/confirm-modal.component';
import { Subscription } from 'rxjs';
import { ImgbbService } from '../../../../../services/main/imgbb.service';
import { environment } from '../../../../../../environments/environments';
import { CareerService } from '../../../../../services/main/career.service';

@Component({
  selector: 'app-add-career',
  standalone: true,
  imports: [CoverComponent, FormsModule, ConfirmModalComponent],
  templateUrl: './add-career.component.html',
  styleUrl: './add-career.component.css'
})
export class AddCareerComponent {
  careerService = inject(CareerService);
  imgbbService = inject(ImgbbService);
  
  model: any;
  private addCareerSubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor() {
    this.model = {
      companyID: 20,   // TODO: environment.hospitalCode
      title: '',
      description: '',
      imageUrl: '',
    };
  }

  onFormSubmit(): void {
    const formData = new FormData();

    formData.append('CompanyID', this.model.companyID);
    formData.append('Title', this.model.title);
    formData.append('Description', this.model.description);
    formData.append('ImageUrl', this.model.imageUrl);

    this.addCareerSubscription = this.careerService.addCareer(formData)
      .subscribe({
        next: (response) => {
          this.confirmModal = true;
        },
        error: (error) => {
          console.error('Error adding Career:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.addCareerSubscription?.unsubscribe();
  }

}
