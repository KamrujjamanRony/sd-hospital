import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../../../components/main/shared/all-modals/confirm-modal/confirm-modal.component';
import { HospitalNewsService } from '../../../../../services/main/hospitalNews.service';

@Component({
    selector: 'app-edit-hospital-news',
    imports: [CoverComponent, FormsModule, ConfirmModalComponent],
    templateUrl: './edit-hospital-news.component.html',
    styleUrl: './edit-hospital-news.component.css'
})
export class EditHospitalNewsComponent {
  hospitalNewsService = inject(HospitalNewsService);
  route = inject(ActivatedRoute);
  
  id: any = null;
  err: any = '';
  model?: any;
  paramsSubscription?: Subscription;
  editHospitalNewsSubscription?: Subscription;
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
          this.hospitalNewsService.getHospitalNews(this.id)
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
    formData.append('NewsSerial', this.model.newsSerial);
    formData.append('Title', this.model.title);
    formData.append('SubTitle', this.model.subTitle);
    formData.append('Description', this.model.description);

    if (this.id) {
      this.editHospitalNewsSubscription = this.hospitalNewsService.updateHospitalNews(this.id, formData)
        .subscribe({
          next: (response) => {
            this.confirmModal = true;
          }
        });
    }
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editHospitalNewsSubscription?.unsubscribe();
  }

}
