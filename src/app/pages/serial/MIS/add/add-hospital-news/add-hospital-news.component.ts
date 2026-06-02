import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { environment } from '../../../../../../environments/environments';
import { AppStore } from '../../../../../store/app.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-hospital-news',
  imports: [CoverComponent, FormsModule],
  templateUrl: './add-hospital-news.component.html',
  styleUrl: './add-hospital-news.component.css'
})
export class AddHospitalNewsComponent {
  private store = inject(AppStore);
  router = inject(Router);
  loading = this.store.loading;
  model = signal<any>(null);

  constructor() {
    this.model.set({
      companyID: environment.hospitalCode,
      newsSerial: null,
      title: "",
      subTitle: "",
      description: "",
    });
  }

  onFormSubmit(): void {
    const formData = new FormData();

    formData.append('CompanyID', this.model().companyID);
    formData.append('NewsSerial', this.model().newsSerial);
    formData.append('Title', this.model().title);
    formData.append('SubTitle', this.model().subTitle);
    formData.append('Description', this.model().description);
    // Use store to add HospitalNews - automatically updates global state
    this.store.addHospitalNews(formData);
    this.router.navigate(['/serial/admin/all-mis/hospitalNews-list']);
  }
}
