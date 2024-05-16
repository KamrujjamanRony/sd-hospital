import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { CoverComponent } from '../../../components/serial/shared/cover/cover.component';
import { AddDepartmentModalComponent } from '../../../components/serial/shared/modal/add-department-modal/add-department-modal.component';
import { EditDepartmentModalComponent } from '../../../components/serial/shared/modal/edit-department-modal/edit-department-modal.component';
import { NavbarComponent } from '../../../components/serial/shared/navbar/navbar.component';
import { AuthService } from '../../../services/serial/auth.service';
import { DepartmentService } from '../../../services/serial/department.service';

@Component({
    selector: 'app-all-department',
    standalone: true,
    templateUrl: './all-department.component.html',
    styleUrl: './all-department.component.css',
    imports: [CoverComponent, RouterLink, AddDepartmentModalComponent, CommonModule, EditDepartmentModalComponent, NavbarComponent]
})
export class AllDepartmentComponent {
  departmentService = inject(DepartmentService)
  queryClient = injectQueryClient()
  authService = inject(AuthService);
  user: any;
  emptyImg: any;
  departments: any;
  selectedId: any;
  showModal: boolean = false;
  addDepartmentModal: boolean = false;
  editDepartmentModal: boolean = false;
  private departmentSubscription?: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  checkRoles(roleId: any) {
    const result = this.user?.roleIds?.find((role: any) => role == roleId)
    return result;
  }

  query = injectQuery(() => ({
    queryKey: ['departments'],
    queryFn: () => this.departmentService.getDepartments(),
  }));

  mutation = injectMutation((client) => ({
    mutationFn: (id: any) => this.departmentService.deleteDepartment(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['departments'] })
    },
  }));

  onDelete(id: any) {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.mutation.mutate(id);
    }
  }

  openDoctorDetails() {
    this.showModal = true;
  }

  openAddDepartmentModal() {
    this.addDepartmentModal = true;
  }

  openEditDepartmentModal(id: any) {
    this.selectedId = id;
    this.editDepartmentModal = true;
  }

  closeDoctorDetails() {
    this.showModal = false;
  }

  closeAddDepartmentModal() {
    this.addDepartmentModal = false;
  }

  closeEditDepartmentModal() {
    this.editDepartmentModal = false;
  }

  ngOnDestroy(): void {
    this.departmentSubscription?.unsubscribe();
  }
}
