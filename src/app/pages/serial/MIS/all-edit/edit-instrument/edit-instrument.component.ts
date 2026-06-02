import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { AppStore } from '../../../../../store/app.store';

@Component({
  selector: 'app-edit-instrument',
  imports: [CoverComponent, FormsModule],
  templateUrl: './edit-instrument.component.html',
  styleUrl: './edit-instrument.component.css'
})
export class EditInstrumentComponent {
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
          this.model.set(this.store.getInstrumentById(this.id()));
        }
      }
    });
  }

  onFormSubmit(): void {
    const formData = new FormData();
    formData.append('CompanyID', this.model().companyID);
    formData.append('ProductSerial', this.model().productSerial);
    formData.append('ProductName', this.model().productName);
    formData.append('Orgin', this.model().orgin);
    formData.append('Description', this.model().description);
    formData.append('PUrl', this.model().pUrl);
    if (this.id()) {
      // Use store to update Instrument - automatically updates global state
      this.store.updateInstrument({ id: this.id(), data: formData });
      this.router.navigate(['/serial/admin/all-mis/instrument-list']);
    }
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
  }
}
