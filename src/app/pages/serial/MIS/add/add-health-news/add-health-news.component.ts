import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../../../components/main/shared/all-modals/confirm-modal/confirm-modal.component';
import { HealthNewsService } from '../../../../../services/main/healthNews.service';
import { ImgbbService } from '../../../../../services/main/imgbb.service';
import { environment } from '../../../../../../environments/environments';

@Component({
    selector: 'app-add-health-news',
    imports: [CoverComponent, FormsModule, ConfirmModalComponent],
    templateUrl: './add-health-news.component.html',
    styleUrl: './add-health-news.component.css'
})
export class AddHealthNewsComponent {
  healthNewsService = inject(HealthNewsService);
  imgbbService = inject(ImgbbService);
  
  model: any;
  private addHealthNewsSubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor() {
    this.model = {
      companyID: environment.hospitalCode,
      healthNewsSerial: null,
      title: "",
      subTitle: "",
      description: "",
      hnUrl: "",
    };
  }

  onFormSubmit(): void {
    const formData = new FormData();

    formData.append('CompanyID', this.model.companyID);
    formData.append('HealthNewsSerial', this.model.healthNewsSerial);
    formData.append('Title', this.model.title);
    formData.append('SubTitle', this.model.subTitle);
    formData.append('Description', this.model.description);
    formData.append('HNUrl', this.model.hnUrl);

    this.addHealthNewsSubscription = this.healthNewsService.addHealthNews(formData)
      .subscribe({
        next: (response) => {
          this.confirmModal = true;
        },
        error: (error) => {
          console.error('Error adding HealthNews:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.addHealthNewsSubscription?.unsubscribe();
  }

}
