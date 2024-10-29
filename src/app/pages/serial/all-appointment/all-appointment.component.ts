import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { catchError, forkJoin, of, Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CoverComponent } from '../../../components/serial/shared/cover/cover.component';
import { AppointmentModalComponent } from '../../../components/serial/shared/modal/appointment-modal/appointment-modal.component';
import { DoctorsService } from '../../../services/serial/doctors.service';
import { DoctorsServiceMain } from '../../../services/main/doctors.service';
import { AuthService } from '../../../services/serial/auth.service';
import { DepartmentService } from '../../../services/serial/department.service';
import { AppointmentsService } from '../../../services/serial/appointments.service';

@Component({
  selector: 'app-all-appointment',
  standalone: true,
  templateUrl: './all-appointment.component.html',
  styleUrls: ['./all-appointment.component.css'],
  imports: [CoverComponent, AppointmentModalComponent, ReactiveFormsModule, CommonModule, FormsModule]
})
export class AllAppointmentComponent {
  appointmentsService = inject(AppointmentsService);
  departmentService = inject(DepartmentService);
  doctorsService = inject(DoctorsService);
  doctorsServiceMain = inject(DoctorsServiceMain);
  router = inject(Router);
  queryClient = injectQueryClient();
  authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  user: any;
  emptyImg: any;
  selectedId: any;
  totalAppointment: any;
  addAppointmentModal: boolean = false;
  editAppointmentModal: boolean = false;
  private appointmentSubscription?: Subscription;
  searchQuery: any = '';
  loading: boolean = false;

  fromDate: any = new Date();
  toDate: any;

  selectedDoctor: any = '';
  selectedDepartment: string = '';
  doctorsWithAppointments: any = [];
  typesWithAppointments: any = [];
  appointments: any[] = [];
  filteredAppointments: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.fetchAppointments()
  }

  onInputChange(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    this.loading = true;
    const from = this.fromDate instanceof Date ? this.fromDate : new Date(this.fromDate);
    const to = this.toDate ? (this.toDate instanceof Date ? this.toDate : new Date(this.toDate)) : from;

    this.appointmentsService.getAppointmentData(this.formatDate(from), this.formatDate(to)).subscribe(data => {
      this.appointments = data;
      this.totalAppointment = data.length;

      const uniqueDrCodes = Array.from(new Set(data.map((appointment: any) => appointment?.drCode)));

      const doctorObservables = uniqueDrCodes.map(drCode =>
        this.doctorsServiceMain.getDoctor(drCode).pipe(
          catchError((error) => {
            console.error(`Error fetching doctor with ID ${drCode}:`, error);
            return of({ drName: "Unknown Doctor" });
          })
        )
      );

      forkJoin(doctorObservables).subscribe(doctorsData => {
        this.doctorsWithAppointments = doctorsData.map((doctor, index) => ({
          id: uniqueDrCodes[index],
          drName: doctor?.drName || "Unknown Doctor",
        }));
        this.applyFilters();
        this.loading = false;
      }, (error) => {
        console.error("Error fetching appointments data:", error);
        this.loading = false;
      });
    });
  }



  applyFilters(): void {
    let filteredAppointments = this.appointments.sort((a, b) => a.sl - b.sl);
    if (this.selectedDoctor) {
      filteredAppointments = filteredAppointments.filter(
        (appointment) => appointment.drCode === this.selectedDoctor
      );
    }
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filteredAppointments = filteredAppointments.filter(appointment =>
        (appointment.pName && appointment.pName.toLowerCase().includes(query)) ||
        (appointment.age && appointment.age.toString().includes(query)) ||
        (appointment.sex && appointment.sex.toLowerCase().includes(query)) ||
        (appointment.remarks && appointment.remarks.toLowerCase().includes(query)) ||
        (appointment.mobile && appointment.mobile.toString().includes(query)) ||
        (appointment.username && appointment.username.toLowerCase().includes(query))
      );
    }
    this.filteredAppointments = filteredAppointments;
    this.totalAppointment = this.filteredAppointments.length;
    this.loading = false;
  }

  onDelete(id: any) {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.appointmentSubscription = this.appointmentsService.deleteAppointmentData(id).subscribe({
        next: () => {
          this.fetchAppointments();
        },
      });
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  transform(value: any, args?: any): any {
    if (!value) return null;

    const datePipe = new DatePipe('en-US');
    return datePipe.transform(value, 'dd/MM/yyyy');
  }

  checkRoles(roleId: any) {
    const result = this.user?.roleIds?.find((role: any) => role == roleId)
    return result;
  }

  openEditAppointmentModal(id: any) {
    this.selectedId = id;
    this.editAppointmentModal = true;
  }

  closeEditAppointmentModal() {
    this.editAppointmentModal = false;
    this.fetchAppointments();
  }

  redirectToHome(): void {
    this.router.navigateByUrl('/serial/admin');
  }


  isPrinting: boolean = false;
  printPage() {
    this.isPrinting = true;
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        this.isPrinting = false;
      }, 1000);
    }, 100);
  }

  ngOnDestroy(): void {
    this.appointmentSubscription?.unsubscribe();
  }
}
