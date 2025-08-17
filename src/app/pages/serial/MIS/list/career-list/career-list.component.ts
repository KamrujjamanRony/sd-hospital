import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
  deleteCareerSubscription?: Subscription;
  emptyImg: any = environment.emptyImg;
  companyID: any = environment.hospitalCode;
  careers$?: Observable<any[]>;
  user = signal<any>(null);
  loading = signal<boolean>(true);
  isConfirmOpen = signal<boolean>(false);
  idToDelete = signal<any>(null);

  constructor() { }

  ngOnInit(): void {
    this.user.set(this.authService.getUser());

    if (!this.careers$) {
      this.loading.set(false);
      this.careers$ = this.careerService.getCompanyCareer();
    }
  }

  checkRoles(roleId: any) {
    const result = this.user()?.roleIds?.find((role: any) => role == roleId)
    return result;
  }

  onDelete(id: any): void {
    this.idToDelete.set(id);
    this.isConfirmOpen.set(true);
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
    this.isConfirmOpen.set(false);
  }

  ngOnDestroy(): void {
    this.deleteCareerSubscription?.unsubscribe();
  }

}
