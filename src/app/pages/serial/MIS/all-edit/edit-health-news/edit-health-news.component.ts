import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { AppStore } from '../../../../../store/app.store';

@Component({
  selector: 'app-edit-health-news',
  imports: [CoverComponent, FormsModule],
  templateUrl: './edit-health-news.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './edit-health-news.component.css'
})
export class EditHealthNewsComponent {
  store = inject(AppStore);
  route = inject(ActivatedRoute);
  router = inject(Router);
  paramsSubscription?: Subscription;
  id = signal<any>(null);
  model = signal<any>(null);

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id.set(params.get('id'));
        if (this.id()) {
          this.model.set(this.store.getHealthNewsById(this.id()));
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
      // Use store to update HealthNews - automatically updates global state
      this.store.updateHealthNews({ id: this.id(), data: formData });
      this.router.navigate(['/serial/admin/all-mis/healthNews-list']);
    }
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
  }

}
