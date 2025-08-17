import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../../../components/main/shared/all-modals/confirm-modal/confirm-modal.component';
import { InstrumentService } from '../../../../../services/main/instrument.service';
import { ImgbbService } from '../../../../../services/main/imgbb.service';

@Component({
  selector: 'app-edit-instrument',
  imports: [CoverComponent, FormsModule, ConfirmModalComponent],
  templateUrl: './edit-instrument.component.html',
  styleUrl: './edit-instrument.component.css'
})
export class EditInstrumentComponent {
  imgbbService = inject(ImgbbService);
  instrumentService = inject(InstrumentService);
  route = inject(ActivatedRoute);
  paramsSubscription?: Subscription;
  editInstrumentSubscription?: Subscription;

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
          this.instrumentService.getInstrument(this.id())
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
    formData.append('ProductSerial', this.model().productSerial);
    formData.append('ProductName', this.model().productName);
    formData.append('Orgin', this.model().orgin);
    formData.append('Description', this.model().description);
    formData.append('PUrl', this.model().pUrl);

    if (this.id()) {
      this.editInstrumentSubscription = this.instrumentService.updateInstrument(this.id(), formData)
        .subscribe({
          next: (response) => {
            this.confirmModal.set(true);
          }
        });
    }
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editInstrumentSubscription?.unsubscribe();
  }
}
