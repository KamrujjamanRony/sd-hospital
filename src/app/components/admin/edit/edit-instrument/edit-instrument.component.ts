import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CoverComponent } from '../../../shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../shared/modals/confirm-modal/confirm-modal.component';
import { InstrumentService } from '../../../../features/services/main/instrument.service';
import { ImgbbService } from '../../../../features/services/main/imgbb.service';

@Component({
  selector: 'app-edit-instrument',
  standalone: true,
  imports: [CoverComponent, FormsModule, ConfirmModalComponent],
  templateUrl: './edit-instrument.component.html',
  styleUrl: './edit-instrument.component.css'
})
export class EditInstrumentComponent {
  yourTitle: any = 'Update Instrument information';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Edit Instrument';
  id: any = null;
  model?: any;
  paramsSubscription?: Subscription;
  editInstrumentSubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor(private route: ActivatedRoute, private instrumentService: InstrumentService, private imgbbService: ImgbbService) { }
  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if (this.id) {
          this.instrumentService.getInstrument(this.id)
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
    formData.append('ProductSerial', this.model.productSerial);
    formData.append('ProductName', this.model.productName);
    formData.append('Orgin', this.model.orgin);
    formData.append('Description', this.model.description);
    formData.append('PUrl', this.model.pUrl);

    if (this.id) {
      this.editInstrumentSubscription = this.instrumentService.updateInstrument(this.id, formData)
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
    this.editInstrumentSubscription?.unsubscribe();
  }
}
