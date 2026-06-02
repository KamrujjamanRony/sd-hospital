import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoverComponent } from '../../../components/serial/shared/cover/cover.component';
import { AppointmentModalSerialComponent } from '../../../components/serial/shared/modal/appointment-modal-serial/appointment-modal-serial.component';
import { AppStore } from '../../../store/app.store';
import { DepartmentService } from '../../../services/serial/department.service';
import { DoctorsService } from '../../../services/serial/doctors.service';
import { AuthService } from '../../../services/serial/auth.service';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.css',
  imports: [CoverComponent, ReactiveFormsModule, FormsModule, AppointmentModalSerialComponent]
})
export class MyAppointmentsComponent {
  store = inject(AppStore);
  departmentService = inject(DepartmentService);
  doctorsService = inject(DoctorsService);
  authService = inject(AuthService);

  user = signal<any>(null);
  emptyImg = signal<any>(null);
  selectedId = signal<any>(null);
  addAppointmentModal = signal<boolean>(false);
  editAppointmentModal = signal<boolean>(false);
  searchQuery = signal<any>('');
  loading = signal<boolean>(false);
  fromDate = signal<any>(null);
  toDate = signal<any>(null);
  selectedDoctor = signal<any>('');
  selectedDepartment = signal<any>('');
  departments = signal<any[]>([]);

  // Computed signals for filtered data
  filteredAppointments = computed(() => {
    let filtered = this.store.appointments().filter(apt => apt.username === this.user()?.username);

    // Filter by doctor
    if (this.selectedDoctor()) {
      filtered = filtered.filter(appointment => appointment.drCode === this.selectedDoctor());
    }

    // Filter by search query
    if (this.searchQuery().length > 2) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(appointment =>
        (appointment.pName && appointment.pName.toLowerCase().includes(query)) ||
        (appointment.age && appointment.age.toString().includes(query)) ||
        (appointment.sex && appointment.sex.toLowerCase().includes(query)) ||
        (appointment.remarks && appointment.remarks.toLowerCase().includes(query)) ||
        (appointment.mobile && appointment.mobile.toString().includes(query)) ||
        (appointment.username && appointment.username.toLowerCase().includes(query))
      );
    }

    return filtered.sort((a: any, b: any) => (+a.sl) - (+b.sl));
  });

  totalAppointment = computed(() => this.filteredAppointments().length);

  // Computed signal for doctors with appointments
  doctorsWithAppointments = computed(() => {
    const appointments = this.store.appointments();
    const uniqueDrCodes = Array.from(new Set(appointments.map(apt => apt?.drCode)));

    return uniqueDrCodes.map(drCode => {
      const doctor = this.store.doctors().find(d => d.id === drCode);
      return {
        id: drCode,
        drName: doctor?.drName || "Unknown Doctor",
      };
    });
  });

  ngOnInit(): void {
    const today = new Date();
    this.fromDate.set(today.toISOString().split('T')[0]);
    this.toDate.set(today.toISOString().split('T')[0]);
    this.user.set(this.authService.getUser());
    this.fetchDepartments();
  }

  onInputChange(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    this.loading.set(true);

    // Use store to load appointments with from and to dates
    this.store.loadAppointments({ from: this.fromDate(), to: this.toDate() });

    // Since loadAppointments is an rxMethod, we need to handle loading state differently
    // You can subscribe to store.loading() or use a different approach
    setTimeout(() => {
      this.loading.set(false);
    }, 1000);
  }

  fetchDepartments(): void {
    // Departments are already in store from app initialization
    this.departments.set(this.store.departments());
  }

  getDoctorName(doctorId: string): string {
    const doctor = this.store.doctors().find(d => d.id === doctorId);
    return doctor?.drName || 'Unknown Doctor';
  }

  getDepartmentName(departmentId: string): string {
    const department = this.store.departments().find(d => d.id === departmentId);
    return department?.departmentName || 'Unknown Department';
  }

  onDelete(id: any): void {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.store.deleteAppointment(id);
    }
  }

  transform(value: any): any {
    if (!value) return null;
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(value, 'dd/MM/yyyy');
  }

  checkRoles(roleId: any): boolean {
    return this.user()?.roleIds?.includes(roleId);
  }

  openEditAppointmentModal(id: any): void {
    this.selectedId.set(id);
    this.editAppointmentModal.set(true);
  }

  closeEditAppointmentModal(): void {
    this.editAppointmentModal.set(false);
  }
}