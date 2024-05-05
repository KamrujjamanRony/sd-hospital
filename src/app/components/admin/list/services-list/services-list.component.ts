import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environments';
import { Observable, Subscription } from 'rxjs';
import { ServicesService } from '../../../../features/services/main/services.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from '../../../shared/modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { CoverComponent } from "../../../shared/cover/cover.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-services-list',
    standalone: true,
    templateUrl: './services-list.component.html',
    styleUrl: './services-list.component.css',
    imports: [CommonModule, CoverComponent, RouterLink, MatDialogModule]
})
export class ServicesListComponent {

  yourTitle: any = 'all Services information';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Services';
  emptyImg: any = environment.emptyImg;
  services$?: Observable<any[]>;
  deleteServicesSubscription?: Subscription;
  isModalOpen = false;
  constructor(private servicesService: ServicesService, private dialog: MatDialog) { 
    if (!this.services$) {
      this.services$ = servicesService.getCompanyServices();
    }
  }

  ngOnInit(): void {}
  
  onDelete(id: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.confirmDelete(id)
      }
    });
  }

  confirmDelete(id: any): void {
    this.deleteServicesSubscription = this.servicesService.deleteServices(id).subscribe({
      next: () => {
        this.services$ = this.servicesService.getCompanyServices();
        this.closeModal();
      },
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  ngOnDestroy(): void {
    this.deleteServicesSubscription?.unsubscribe();
  }
}
