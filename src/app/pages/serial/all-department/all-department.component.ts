import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CoverComponent } from '../../../components/serial/shared/cover/cover.component';
import { AddDepartmentModalComponent } from '../../../components/serial/shared/modal/add-department-modal/add-department-modal.component';
import { EditDepartmentModalComponent } from '../../../components/serial/shared/modal/edit-department-modal/edit-department-modal.component';

import { AppStore } from '../../../store/app.store';
import { AuthService } from '../../../services/serial/auth.service';

@Component({
  selector: 'app-all-department',
  standalone: true,
  templateUrl: './all-department.component.html',
  styleUrl: './all-department.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CoverComponent, AddDepartmentModalComponent, EditDepartmentModalComponent]
})
export class AllDepartmentComponent implements OnInit {
  store = inject(AppStore);
  authService = inject(AuthService);

  user = signal<any>(null);
  emptyImg = './images/department.png'; // Fixed signal to direct value
  selectedId = signal<any>(null);
  addDepartmentModal = signal<boolean>(false);
  editDepartmentModal = signal<boolean>(false);

  ngOnInit(): void {
    this.user.set(this.authService.getUser());
    // No need to load departments - they're already in store from app initialization
  }

  checkRoles(roleId: any): boolean {
    return this.user()?.roleIds?.includes(roleId);
  }

  onDelete(id: any): void {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.store.deleteDepartment(id);
    }
  }

  openAddDepartmentModal(): void {
    this.addDepartmentModal.set(true);
  }

  openEditDepartmentModal(id: any): void {
    this.selectedId.set(id);
    this.editDepartmentModal.set(true);
  }

  closeAddDepartmentModal(): void {
    this.addDepartmentModal.set(false);
    // No need to refresh - state is automatically updated
  }

  closeEditDepartmentModal(): void {
    this.editDepartmentModal.set(false);
    // No need to refresh - state is automatically updated
  }
}