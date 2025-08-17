import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../../../components/main/shared/all-modals/confirm-modal/confirm-modal.component';
import { HealthNewsService } from '../../../../../services/main/healthNews.service';
import { ImgbbService } from '../../../../../services/main/imgbb.service';

@Component({
  selector: 'app-edit-health-news',
  imports: [CoverComponent, FormsModule, ConfirmModalComponent],
  templateUrl: './edit-health-news.component.html',
  styleUrl: './edit-health-news.component.css'
})
export class EditHealthNewsComponent {
  imgbbService = inject(ImgbbService);
  healthNewsService = inject(HealthNewsService);
  route = inject(ActivatedRoute);
  paramsSubscription?: Subscription;
  editHealthNewsSubscription?: Subscription;
  yourTitle: any = 'Update Health News';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Edit Health News';
  id = signal<any>(null);
  model = signal<any>(null);
  confirmModal = signal<boolean>(false);

  closeModal() {
    this.confirmModal.set(false);
  }

  constructor() { }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id.set(params.get('id'));
        if (this.id()) {
          this.healthNewsService.getHealthNews(this.id())
            .subscribe({
              next: (response) => {
                this.model.set(response);
              }
            });
        }
      }
    });
  }

  onFormSubmit(): void {

    const formData = new FormData();

    formData.append('CompanyID', this.model().companyID);
    formData.append('HealthNewsSerial', this.model().healthNewsSerial);
    formData.append('Title', this.model().title);
    formData.append('SubTitle', this.model().subTitle);
    formData.append('Description', this.model().description);
    formData.append('HNUrl', this.model().hnUrl);

    if (this.id()) {
      this.editHealthNewsSubscription = this.healthNewsService.updateHealthNews(this.id(), formData)
        .subscribe({
          next: (response) => {
            this.confirmModal.set(true);
          }
        });
    }
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editHealthNewsSubscription?.unsubscribe();
  }

}
