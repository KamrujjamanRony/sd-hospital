import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../../services/serial/auth.service';
import { environment } from '../../../../../../environments/environments';
import { Observable, Subscription } from 'rxjs';
import { DeleteConfirmationModalComponent } from '../../../../../components/main/shared/all-modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { CareerService } from '../../../../../services/main/career.service';



@Component({
    selector: 'app-career-list',
    imports: [CommonModule, CoverComponent, RouterLink, DeleteConfirmationModalComponent],
    templateUrl: './career-list.component.html',
    styleUrl: './career-list.component.css'
})
export class CareerListComponent {
  authService = inject(AuthService);
  careerService = inject(CareerService);
  router = inject(Router);
  user: any;
  emptyImg: any = environment.emptyImg;
  loading: boolean = true;
  careers$?: Observable<any[]>;
  deleteCareerSubscription?: Subscription;
  companyID: any = environment.hospitalCode;
  isConfirmOpen = false;
  idToDelete: any;
  
  constructor() { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    
    if (!this.careers$) {
      this.loading = false;
      this.careers$ = this.careerService.getCompanyCareer();
    }
  }

  checkRoles(roleId: any) {
    const result = this.user?.roleIds?.find((role: any) => role == roleId)
    return result;
  }
  
  onDelete(id: any): void {
    this.idToDelete = id;
    this.isConfirmOpen = true;
  }

  confirmDelete(): void {
    this.deleteCareerSubscription = this.careerService.deleteCareer(this.idToDelete).subscribe({
      next: () => {
        this.careers$ = this.careerService.getCompanyCareer();
        this.closeModal();
      },
    });
  }

  closeModal(): void {
    this.isConfirmOpen = false;
  }

  ngOnDestroy(): void {
    this.deleteCareerSubscription?.unsubscribe();
  }

}
