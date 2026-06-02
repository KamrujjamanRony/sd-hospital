import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { EditDoctorModalComponent } from '../../../components/serial/shared/modal/edit-doctor-modal/edit-doctor-modal.component';
import { AddDoctorModalComponent } from '../../../components/serial/shared/modal/add-doctor-modal/add-doctor-modal.component';
import { CoverComponent } from '../../../components/serial/shared/cover/cover.component';

import { AppStore } from '../../../store/app.store';

@Component({
  selector: 'app-all-doctors',
  standalone: true,
  templateUrl: './all-doctors.component.html',
  styleUrl: './all-doctors.component.css',
  imports: [CoverComponent, AddDoctorModalComponent, EditDoctorModalComponent, FormsModule]
})
export class SerialAllDoctorsComponent {
  store = inject(AppStore);

  emptyImg = './images/doctor.png';
  selectedId = signal<any>(null);
  addDoctorModal = signal<boolean>(false);
  editDoctorModal = signal<boolean>(false);
  selectedDepartment = signal<string>('');

  // Computed signals for filtered data
  filteredDoctors = () => {
    const doctors = this.store.doctorsSortedBySerial();
    const selectedDept = this.selectedDepartment();

    if (!selectedDept) return doctors;

    return doctors.filter(doctor =>
      doctor && doctor.departmentId == selectedDept
    );
  };

  onDepartmentChange(department: string): void {
    this.selectedDepartment.set(department);
  }

  onDelete(id: any): void {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.store.deleteDoctor(id);
    }
  }

  openAddDoctorModal(): void {
    this.addDoctorModal.set(true);
  }

  openEditDoctorModal(id: any): void {
    this.selectedId.set(id);
    this.editDoctorModal.set(true);
  }

  closeAddDoctorModal(): void {
    this.addDoctorModal.set(false);
  }

  closeEditDoctorModal(): void {
    this.editDoctorModal.set(false);
  }
}