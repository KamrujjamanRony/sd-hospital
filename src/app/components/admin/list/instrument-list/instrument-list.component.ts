import { Component } from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { CoverComponent } from '../../../shared/cover/cover.component';
import { environment } from '../../../../../environments/environments';
import { InstrumentService } from '../../../../features/services/instrument.service';
import { DeleteConfirmationModalComponent } from '../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-instrument-list',
  standalone: true,
  imports: [CommonModule, CoverComponent, RouterLink, MatDialogModule],
  templateUrl: './instrument-list.component.html',
  styleUrl: './instrument-list.component.css'
})
export class InstrumentListComponent {
  yourTitle: any = 'all Instrument information';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Instrument';
  emptyImg: any = environment.emptyImg;
  instruments$?: Observable<any[]>;
  deleteInstrumentSubscription?: Subscription;
  isModalOpen = false;
  constructor(private instrumentService: InstrumentService, private dialog: MatDialog) { 
    if (!this.instruments$) {
      this.instruments$ = instrumentService.getCompanyInstrument().pipe(
        map(doctors => doctors.sort((a, b) => a.productSerial - b.productSerial))
      );
    }
  }

  ngOnInit(): void {
    // this.Instruments$ = this.instrumentService.getCompanyInstrument(this.companyID);

    // this.Instruments$.subscribe(() => {
    //   this.loading = false;
    // });
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
