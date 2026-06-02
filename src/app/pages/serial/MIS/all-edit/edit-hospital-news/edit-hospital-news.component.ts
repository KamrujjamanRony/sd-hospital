import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { AppStore } from '../../../../../store/app.store';

@Component({
  selector: 'app-edit-hospital-news',
  imports: [CoverComponent, FormsModule],
  templateUrl: './edit-hospital-news.component.html',
  styleUrl: './edit-hospital-news.component.css'
})
export class EditHospitalNewsComponent {
  store = inject(AppStore);
  router = inject(Router);
  route = inject(ActivatedRoute);
  paramsSubscription?: Subscription;
  id = signal<any>(null);
  model = signal<any>(null);

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id.set(params.get('id'));
        if (this.id()) {
          this.model.set(this.store.getHospitalNewsById(this.id()));
        }
      }
    });
  }

  onFormSubmit(): void {
    const formData = new FormData();

    formData.append('CompanyID', this.model().companyID);
    formData.append('NewsSerial', this.model().newsSerial);
    formData.append('Title', this.model().title);
    formData.append('SubTitle', this.model().subTitle);
    formData.append('Description', this.model().description);

    if (this.id()) {
      // Use store to update HospitalNews - automatically updates global state
      this.store.updateHospitalNews({ id: this.id(), data: formData });
      this.router.navigate(['/serial/admin/all-mis/hospitalNews-list']);
    }
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
  }

}
