import { Component, inject } from '@angular/core';
import { environment } from '../../../../../../environments/environments';
import { Observable, Subscription } from 'rxjs';
import { ServicesService } from '../../../../../services/main/services.service';
import { DeleteConfirmationModalComponent } from '../../../../../components/main/shared/all-modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { CoverComponent } from "../../../../../components/main/shared/cover/cover.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-services-list',
    templateUrl: './services-list.component.html',
    styleUrl: './services-list.component.css',
    imports: [CommonModule, CoverComponent, RouterLink, DeleteConfirmationModalComponent]
})
export class ServicesListComponent {
  servicesService = inject(ServicesService);

  emptyImg: any = environment.emptyImg;
  services$?: Observable<any[]>;
  deleteServicesSubscription?: Subscription;
  isConfirmOpen = false;
  idToDelete: any;
  
  constructor() { }

  ngOnInit(): void {
    if (!this.services$) {
      this.services$ = this.servicesService.getCompanyServices();
    }

  }
  
  onDelete(id: any): void {
    this.idToDelete = id;
    this.isConfirmOpen = true;
  }

  confirmDelete(): void {
    this.deleteServicesSubscription = this.servicesService.deleteServices(this.idToDelete).subscribe({
      next: () => {
        this.services$ = this.servicesService.getCompanyServices();
        this.closeModal();
      },
    });
  }

  closeModal(): void {
    this.isConfirmOpen = false;
  }

  ngOnDestroy(): void {
    this.deleteServicesSubscription?.unsubscribe();
  }
}
