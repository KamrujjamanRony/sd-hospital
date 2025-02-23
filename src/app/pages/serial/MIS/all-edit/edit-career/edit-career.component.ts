import { Component, inject } from '@angular/core';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../../../../components/main/shared/all-modals/confirm-modal/confirm-modal.component';
import { ActivatedRoute } from '@angular/router';
import { ImgbbService } from '../../../../../services/main/imgbb.service';
import { Subscription } from 'rxjs';
import { CareerService } from '../../../../../services/main/career.service';

@Component({
    selector: 'app-edit-career',
    imports: [CoverComponent, FormsModule, ConfirmModalComponent],
    templateUrl: './edit-career.component.html',
    styleUrl: './edit-career.component.css'
})
export class EditCareerComponent {
  careerService = inject(CareerService);
  route = inject(ActivatedRoute);
  imgbbService = inject(ImgbbService);
  
  id: any = null;
  CareerInfo?: any;
  paramsSubscription?: Subscription;
  editCareerSubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor() { }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if (this.id) {
          this.careerService.getCareer(this.id)
            .subscribe({
              next: (response) => {
                this.CareerInfo = response;
              }
            });
        }
      }
    });
  }

  onFormSubmit(): void {

    const formData = new FormData();

    formData.append('CompanyID', this.CareerInfo?.companyID);
    formData.append('Title', this.CareerInfo?.title);
    formData.append('Description', this.CareerInfo?.description);
    formData.append('ImageUrl', this.CareerInfo?.imageUrl);

    if (this.id) {
      this.editCareerSubscription = this.careerService.updateCareer(this.id, formData)
        .subscribe({
          next: () => {
            this.confirmModal = true;
          }
        });
    }
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editCareerSubscription?.unsubscribe();
  }

}
