import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CoverComponent } from '../../../shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';
import { InstrumentService } from '../../../../features/services/instrument.service';
import { ImgbbService } from '../../../../features/services/imgbb.service';
import { environment } from '../../../../../environments/environments';

@Component({
  selector: 'app-add-instrument',
  standalone: true,
  imports: [CoverComponent, FormsModule, ConfirmModalComponent],
  templateUrl: './add-instrument.component.html',
  styleUrl: './add-instrument.component.css'
})
export class AddInstrumentComponent {
  // Component properties
  yourTitle: any = 'add a Instrument';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Add Instrument';
  model: any;
  private addInstrumentSubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor(private instrumentService: InstrumentService, private imgbbService: ImgbbService) {
    // Initialize model properties
    this.model = {
      companyID: environment.hospitalCode,
      productSerial: null,
      productName: "",
      orgin: "",
      description: "",
      pUrl: "",
    };
  }

  // Handle form submission
  onFormSubmit(): void {
    const formData = new FormData();

    formData.append('CompanyID', this.model.companyID);
    formData.append('ProductSerial', this.model.productSerial);
    formData.append('ProductName', this.model.productName);
    formData.append('Orgin', this.model.orgin);
    formData.append('Description', this.model.description);
    formData.append('PUrl', this.model.pUrl);

    this.addInstrumentSubscription = this.instrumentService.addInstrument(formData)
      .subscribe({
        next: (response) => {
          // toast
          this.confirmModal = true;
        },
        error: (error) => {
          console.error('Error adding Instrument:', error);
        }
      });
  }

  // Unsubscribe from the subscription to avoid memory leaks
  ngOnDestroy(): void {
    this.addInstrumentSubscription?.unsubscribe();
  }

}
