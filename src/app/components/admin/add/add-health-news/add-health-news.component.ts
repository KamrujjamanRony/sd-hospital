import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CoverComponent } from '../../../shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';
import { HealthNewsService } from '../../../../features/services/healthNews.service';
import { ImgbbService } from '../../../../features/services/imgbb.service';
import { environment } from '../../../../../environments/environments';

@Component({
  selector: 'app-add-health-news',
  standalone: true,
  imports: [CoverComponent, FormsModule, ConfirmModalComponent],
  templateUrl: './add-health-news.component.html',
  styleUrl: './add-health-news.component.css'
})
export class AddHealthNewsComponent {
  // Component properties
  yourTitle: any = 'add a Health News';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Add Health News';
  model: any;
  private addHealthNewsSubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor(private HealthNewsService: HealthNewsService, private imgbbService: ImgbbService) {
    // Initialize model properties
    this.model = {
      companyID: environment.hospitalCode,
      healthNewsSerial: null,
      title: "",
      subTitle: "",
      description: "",
      hnUrl: "",
    };
  }

  // Handle form submission
  onFormSubmit(): void {
    const formData = new FormData();

    formData.append('CompanyID', this.model.companyID);
    formData.append('HealthNewsSerial', this.model.healthNewsSerial);
    formData.append('Title', this.model.title);
    formData.append('SubTitle', this.model.subTitle);
    formData.append('Description', this.model.description);
    formData.append('HNUrl', this.model.hnUrl);

    this.addHealthNewsSubscription = this.HealthNewsService.addHealthNews(formData)
      .subscribe({
        next: (response) => {
          // toast
          this.confirmModal = true;
        },
        error: (error) => {
          console.error('Error adding HealthNews:', error);
        }
      });
  }

  // Unsubscribe from the subscription to avoid memory leaks
  ngOnDestroy(): void {
    this.addHealthNewsSubscription?.unsubscribe();
  }

}
