import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { EditDoctorModalComponent } from '../../../components/serial/shared/modal/edit-doctor-modal/edit-doctor-modal.component';
import { AddDoctorModalComponent } from '../../../components/serial/shared/modal/add-doctor-modal/add-doctor-modal.component';
import { CoverComponent } from '../../../components/serial/shared/cover/cover.component';
import { DoctorsService } from '../../../services/serial/doctors.service';
import { DepartmentService } from '../../../services/serial/department.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-doctors',
  standalone: true,
  templateUrl: './all-doctors.component.html',
  styleUrl: './all-doctors.component.css',
  imports: [CommonModule, CoverComponent, AddDoctorModalComponent, EditDoctorModalComponent, FormsModule]
})
export class SerialAllDoctorsComponent implements OnInit, OnDestroy {
  doctorsService = inject(DoctorsService);
  departmentService = inject(DepartmentService);

  emptyImg = '../../../assets/images/doctor.png';
  selectedId: any;
  addDoctorModal: boolean = false;
  editDoctorModal: boolean = false;
  private subscriptions: Subscription[] = [];
  selectedDepartment: string = '';
  departmentWithDoctor: any[] = [];
  doctors: any[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.subscriptions.push(
      forkJoin([
        this.doctorsService.getDoctors(),
        this.departmentService.getDepartments()
      ]).subscribe({
        next: ([doctors, departments]) => {
          this.doctors = doctors;
          const departmentIds = doctors.map((doctor: any) => doctor.departmentId);
          this.departmentWithDoctor = departments.filter((dept: any) =>
            departmentIds.includes(dept.id)
          );
        },
        error: (error) => {
          console.error('Error loading data:', error);
        }
      })
    );
  }

  sortbySl(data: any[]): any[] {
    if (!data || data.length === 0) {
      return data;
    }
    return [...data].sort((a, b) => a.drSerial - b.drSerial);
  }

  filterDoctorsByDepartment(doctors: any[]): any[] {
    if (!this.selectedDepartment) {
      return doctors;
    }
    return doctors.filter(doctor =>
      doctor && doctor.departmentId == this.selectedDepartment
    );
  }

  onDelete(id: any): void {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.subscriptions.push(
        this.doctorsService.deleteDoctor(id).subscribe({
          next: () => {
            this.loadData(); // Refresh the list after deletion
          },
          error: (error) => {
            console.error('Error deleting doctor:', error);
          }
        })
      );
    }
  }

  openAddDoctorModal(): void {
    this.addDoctorModal = true;
  }

  openEditDoctorModal(id: any): void {
    this.selectedId = id;
    this.editDoctorModal = true;
  }

  closeAddDoctorModal(): void {
    this.addDoctorModal = false;
    this.loadData(); // Refresh the list after adding
  }

  closeEditDoctorModal(): void {
    this.editDoctorModal = false;
    this.loadData(); // Refresh the list after editing
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}