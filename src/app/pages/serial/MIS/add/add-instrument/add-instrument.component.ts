import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { environment } from '../../../../../../environments/environments';
import { AppStore } from '../../../../../store/app.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-instrument',
  imports: [CoverComponent, FormsModule],
  templateUrl: './add-instrument.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './add-instrument.component.css'
})
export class AddInstrumentComponent {
  private store = inject(AppStore);
  router = inject(Router);
  loading = this.store.loading;

  model = signal<any>(null);

  constructor() {
    this.model.set({
      companyID: environment.hospitalCode,
      productSerial: null,
      productName: "",
      orgin: "",
      description: "",
      pUrl: "",
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
    // Use store to add Instrument - automatically updates global state
    this.store.addInstrument(formData);
    this.router.navigate(['/serial/admin/all-mis/instrument-list']);
  }
}
