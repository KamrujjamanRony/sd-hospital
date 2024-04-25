import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CoverComponent } from '../../../shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';
import { HospitalNewsService } from '../../../../features/services/hospitalNews.service';
import { environment } from '../../../../../environments/environments';

@Component({
  selector: 'app-add-hospital-news',
  standalone: true,
  imports: [CoverComponent, FormsModule, ConfirmModalComponent],
  templateUrl: './add-hospital-news.component.html',
  styleUrl: './add-hospital-news.component.css'
})
export class AddHospitalNewsComponent {
  // Component properties
  yourTitle: any = 'add a Hospital News';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Add Hospital News';
  err: any = '';
  model: any;
  private addHospitalNewsSubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor(private HospitalNewsService: HospitalNewsService) {
    // Initialize model properties
    this.model = {
      companyID: environment.hospitalCode,
      newsSerial: null,
      title: "",
      subTitle: "",
      description: "",
    };
  }

  // Handle form submission
  onFormSubmit(): void {
    const formData = new FormData();

    formData.append('CompanyID', this.model.companyID);
    formData.append('NewsSerial', this.model.newsSerial);
    formData.append('Title', this.model.title);
    formData.append('SubTitle', this.model.subTitle);
    formData.append('Description', this.model.description);

    this.addHospitalNewsSubscription = this.HospitalNewsService.addHospitalNews(formData)
      .subscribe({
        next: (response) => {
          // toast
          this.confirmModal = true;
        },
        error: (error) => {
          console.error('Error adding HospitalNews:', error);
        }
      });
  }

  // Unsubscribe from the subscription to avoid memory leaks
  ngOnDestroy(): void {
    this.addHospitalNewsSubscription?.unsubscribe();
  }

}
