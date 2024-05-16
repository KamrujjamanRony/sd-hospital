import { Component, inject } from '@angular/core';
import { environment } from '../../../../../../environments/environments';
import { Observable, Subscription } from 'rxjs';
import { ServicesService } from '../../../../../services/main/services.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from '../../../../../components/main/shared/all-modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { CoverComponent } from "../../../../../components/main/shared/cover/cover.component";
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
  servicesService = inject(ServicesService);
  dialog = inject(MatDialog);
  emptyImg: any = environment.emptyImg;
  services$?: Observable<any[]>;
  deleteServicesSubscription?: Subscription;
  isModalOpen = false;
  constructor() { }

  ngOnInit(): void {
    if (!this.services$) {
      this.services$ = this.servicesService.getCompanyServices();
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
