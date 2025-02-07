import { Component, inject } from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { environment } from '../../../../../../environments/environments';
import { InstrumentService } from '../../../../../services/main/instrument.service';
import { DeleteConfirmationModalComponent } from '../../../../../components/main/shared/all-modals/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
    selector: 'app-instrument-list',
    imports: [CommonModule, CoverComponent, RouterLink, DeleteConfirmationModalComponent],
    templateUrl: './instrument-list.component.html',
    styleUrl: './instrument-list.component.css'
})
export class InstrumentListComponent {
  instrumentService = inject(InstrumentService);

  emptyImg: any = environment.emptyImg;
  instruments$?: Observable<any[]>;
  deleteInstrumentSubscription?: Subscription;
  isConfirmOpen = false;
  idToDelete: any;
  
  constructor() { }

  ngOnInit(): void { 
    if (!this.instruments$) {
      this.instruments$ = this.instrumentService.getCompanyInstrument().pipe(
        map(doctors => doctors.sort((a, b) => a.productSerial - b.productSerial))
      );
    }
  }
  
  onDelete(id: any): void {
    this.idToDelete = id;
    this.isConfirmOpen = true;
  }

  confirmDelete(): void {
    this.deleteInstrumentSubscription = this.instrumentService.deleteInstrument(this.idToDelete).subscribe({
      next: () => {
        this.instruments$ = this.instrumentService.getCompanyInstrument();
        this.closeModal();
      },
    });
  }

  closeModal(): void {
    this.isConfirmOpen = false;
  }

  ngOnDestroy(): void {
    this.deleteInstrumentSubscription?.unsubscribe();
  }

}
