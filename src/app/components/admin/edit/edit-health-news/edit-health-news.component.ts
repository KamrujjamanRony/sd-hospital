import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CoverComponent } from '../../../shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../shared/modals/confirm-modal/confirm-modal.component';
import { HealthNewsService } from '../../../../features/services/main/healthNews.service';
import { ImgbbService } from '../../../../features/services/main/imgbb.service';

@Component({
  selector: 'app-edit-health-news',
  standalone: true,
  imports: [CoverComponent, FormsModule, ConfirmModalComponent],
  templateUrl: './edit-health-news.component.html',
  styleUrl: './edit-health-news.component.css'
})
export class EditHealthNewsComponent {
  yourTitle: any = 'Update Health News';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Edit Health News';
  id: any = null;
  model?: any;
  paramsSubscription?: Subscription;
  editHealthNewsSubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor(private route: ActivatedRoute, private HealthNewsService: HealthNewsService, private imgbbService: ImgbbService) { }
  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if (this.id) {
          this.HealthNewsService.getHealthNews(this.id)
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
    formData.append('HealthNewsSerial', this.model.healthNewsSerial);
    formData.append('Title', this.model.title);
    formData.append('SubTitle', this.model.subTitle);
    formData.append('Description', this.model.description);
    formData.append('HNUrl', this.model.hnUrl);

    if (this.id) {
      this.editHealthNewsSubscription = this.HealthNewsService.updateHealthNews(this.id, formData)
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
    this.editHealthNewsSubscription?.unsubscribe();
  }

}
