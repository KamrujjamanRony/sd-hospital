import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoverComponent } from '../../../components/serial/shared/cover/cover.component';
import { AddDepartmentModalComponent } from '../../../components/serial/shared/modal/add-department-modal/add-department-modal.component';
import { EditDepartmentModalComponent } from '../../../components/serial/shared/modal/edit-department-modal/edit-department-modal.component';
import { AuthService } from '../../../services/serial/auth.service';
import { DepartmentService } from '../../../services/serial/department.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-department',
  standalone: true,
  templateUrl: './all-department.component.html',
  styleUrl: './all-department.component.css',
  imports: [CommonModule, CoverComponent, AddDepartmentModalComponent, EditDepartmentModalComponent]
})
export class AllDepartmentComponent implements OnInit, OnDestroy {
  departmentService = inject(DepartmentService);
  authService = inject(AuthService);

  user = signal<any>(null);
  emptyImg = signal<any>(null);
  departments = signal<any[]>([]);
  selectedId = signal<any>(null);
  showModal = signal<boolean>(false);
  addDepartmentModal = signal<boolean>(false);
  editDepartmentModal = signal<boolean>(false);
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.user.set(this.authService.getUser());
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.subscriptions.push(
      this.departmentService.getDepartments().subscribe({
        next: (departments) => {
          this.departments.set(departments);
        },
        error: (error) => {
          console.error('Error loading departments:', error);
        }
      })
    );
  }

  checkRoles(roleId: any): boolean {
    return this.user()?.roleIds?.includes(roleId);
  }

  onDelete(id: any): void {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.subscriptions.push(
        this.departmentService.deleteDepartment(id).subscribe({
          next: () => {
            this.loadDepartments(); // Refresh the list after deletion
          },
          error: (error) => {
            console.error('Error deleting department:', error);
          }
        })
      );
    }
  }

  openDoctorDetails(): void {
    this.showModal.set(true);
  }

  openAddDepartmentModal(): void {
    this.addDepartmentModal.set(true);
  }

  openEditDepartmentModal(id: any): void {
    this.selectedId.set(id);
    this.editDepartmentModal.set(true);
  }

  closeDoctorDetails(): void {
    this.showModal.set(false);
  }

  closeAddDepartmentModal(): void {
    this.addDepartmentModal.set(false);
    this.loadDepartments(); // Refresh the list after adding
  }

  closeEditDepartmentModal(): void {
    this.editDepartmentModal.set(false);
    this.loadDepartments(); // Refresh the list after editing
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}