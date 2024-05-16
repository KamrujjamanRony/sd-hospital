import { Component, inject } from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { environment } from '../../../../../../environments/environments';
import { InstrumentService } from '../../../../../services/main/instrument.service';
import { DeleteConfirmationModalComponent } from '../../../../../components/main/shared/all-modals/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-instrument-list',
  standalone: true,
  imports: [CommonModule, CoverComponent, RouterLink, MatDialogModule],
  templateUrl: './instrument-list.component.html',
  styleUrl: './instrument-list.component.css'
})
export class InstrumentListComponent {
  instrumentService = inject(InstrumentService);
  dialog = inject(MatDialog);
  emptyImg: any = environment.emptyImg;
  instruments$?: Observable<any[]>;
  deleteInstrumentSubscription?: Subscription;
  isModalOpen = false;
  constructor() { }

  ngOnInit(): void { 
    if (!this.instruments$) {
      this.instruments$ = this.instrumentService.getCompanyInstrument().pipe(
        map(doctors => doctors.sort((a, b) => a.productSerial - b.productSerial))
      );
    }
  }
  
  onDelete(id: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.confirmDelete(id)
      }
    });
  }

  confirmDelete(id: any): void {
    this.deleteInstrumentSubscription = this.instrumentService.deleteInstrument(id).subscribe({
      next: () => {
        this.instruments$ = this.instrumentService.getCompanyInstrument();
        this.closeModal();
      },
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  ngOnDestroy(): void {
    this.deleteInstrumentSubscription?.unsubscribe();
  }

}
