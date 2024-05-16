import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../../../components/main/shared/all-modals/confirm-modal/confirm-modal.component';
import { InstrumentService } from '../../../../../services/main/instrument.service';
import { ImgbbService } from '../../../../../services/main/imgbb.service';
import { environment } from '../../../../../../environments/environments';

@Component({
  selector: 'app-add-instrument',
  standalone: true,
  imports: [CoverComponent, FormsModule, ConfirmModalComponent],
  templateUrl: './add-instrument.component.html',
  styleUrl: './add-instrument.component.css'
})
export class AddInstrumentComponent {
  instrumentService = inject(InstrumentService);
  imgbbService = inject(ImgbbService);
  
  model: any;
  private addInstrumentSubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor() {
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
