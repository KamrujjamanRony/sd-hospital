import { Component, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { EditDoctorModalComponent } from '../../../components/serial/shared/modal/edit-doctor-modal/edit-doctor-modal.component';
import { AddDoctorModalComponent } from '../../../components/serial/shared/modal/add-doctor-modal/add-doctor-modal.component';
import { CoverComponent } from '../../../components/serial/shared/cover/cover.component';
import { DoctorsService } from '../../../services/serial/doctors.service';
import { DepartmentService } from '../../../services/serial/department.service';
@Component({
    selector: 'app-all-doctors',
    standalone: true,
    templateUrl: './all-doctors.component.html',
    styleUrl: './all-doctors.component.css',
    imports: [CommonModule, RouterLink, CoverComponent, AddDoctorModalComponent, EditDoctorModalComponent, FormsModule]
})
export class SerialAllDoctorsComponent {
  doctorsService = inject(DoctorsService);
  departmentService = inject(DepartmentService);
  queryClient = injectQueryClient()
  emptyImg = '../../../assets/images/doctor.png';
  selectedId: any;
  addDoctorModal: boolean = false;
  editDoctorModal: boolean = false;
  private doctorSubscription?: Subscription;
  selectedDepartment: string = '';
  departmentWithDoctor: any = [];

  constructor() {}

  ngOnInit(): void {
    this.getDepartmentWithDoctor();
  }

  query = injectQuery(() => ({
    queryKey: ['doctors'],
    queryFn: () => this.doctorsService.getDoctors(),
  }));
  
  sortbySl(data: any): any {
    if (data.length === 0) {
      return data;
    }

    return data.sort((a: any, b: any) => a.drSerial - b.drSerial);
  }

  async getDepartmentWithDoctor(): Promise<void> {
    const departments = await this.doctorsService.getDoctors();
    const departmentIds = departments.map(data => data.departmentId);
    this.departmentWithDoctor = (await this.departmentService.getDepartments()).filter(data => departmentIds.includes(data.id));
  }

  filterDoctorsByDepartment(doctors: any): any {
    if (this.selectedDepartment == "") {
      return doctors; // If search query is empty, return all doctors
    }

    const selected = doctors.filter((data: any) => data && data.departmentId == this.selectedDepartment);
    this.selectedDepartment = selected[0]?.departmentId;
    return selected;
  }

  mutation = injectMutation((client) => ({
    mutationFn: (id: any) => this.doctorsService.deleteDoctor(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['doctors'] })
    },
  }));

  onDelete(id: any) {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.mutation.mutate(id);
    }
  }

  openAddDoctorModal() {
    this.addDoctorModal = true;
  }

  openEditDoctorModal(id: any) {
    this.selectedId = id;
    this.editDoctorModal = true;
  }

  closeAddDoctorModal() {
    this.addDoctorModal = false;
  }

  closeEditDoctorModal() {
    this.editDoctorModal = false;
  }

  ngOnDestroy(): void {
    this.doctorSubscription?.unsubscribe();
  }
}
