import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { environment } from '../../../../../../environments/environments';
import { AppStore } from '../../../../../store/app.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-health-news',
  imports: [CoverComponent, FormsModule],
  templateUrl: './add-health-news.component.html',
  styleUrl: './add-health-news.component.css'
})
export class AddHealthNewsComponent {
  private store = inject(AppStore);
  router = inject(Router);
  loading = this.store.loading;

  model = signal<any>(null);
  confirmModal = signal<boolean>(false);

  closeModal() {
    this.confirmModal.set(false);
  }

  constructor() {
    this.model.set({
      companyID: environment.hospitalCode,
      healthNewsSerial: null,
      title: "",
      subTitle: "",
      description: "",
      hnUrl: "",
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
    // Use store to add HealthNews - automatically updates global state
    this.store.addHealthNews(formData);
    this.router.navigate(['/serial/admin/all-mis/healthNews-list']);
  }
}
