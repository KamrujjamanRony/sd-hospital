import { Component, inject } from '@angular/core';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CoverComponent } from '../../../components/serial/shared/cover/cover.component';
import { AppointmentModalComponent } from '../../../components/serial/shared/modal/appointment-modal/appointment-modal.component';
import { AppointmentService } from '../../../features/services/serial/appointment.service';
import { DepartmentService } from '../../../features/services/serial/department.service';
import { DoctorsService } from '../../../features/services/serial/doctors.service';

@Component({
    selector: 'app-all-appointment',
    standalone: true,
    templateUrl: './all-appointment.component.html',
    styleUrl: './all-appointment.component.css',
    imports: [CoverComponent, AppointmentModalComponent, FormsModule, CommonModule]
})
export class AllAppointmentComponent {
  appointmentService = inject(AppointmentService);
  departmentService = inject(DepartmentService);
  doctorsService = inject(DoctorsService);
  router = inject(Router);
  queryClient = injectQueryClient();
  emptyImg: any;
  selectedId: any;
  totalAppointment: any;
  addAppointmentModal: boolean = false;
  editAppointmentModal: boolean = false;
  private appointmentSubscription?: Subscription;
  searchQuery: string = '';
  
  selectedDate: string = '';
  selectedDoctor: string = '';
  selectedDepartment: string = '';
  doctorsWithAppointments: any = [];

  constructor() {}

  ngOnInit(): void {
    this.getDoctorsWithAppointments();
  }

  redirectToHome(): void {
    this.router.navigateByUrl('/serial/admin');
  }

  async getDoctorsWithAppointments(): Promise<void> {
    const appointments = await this.appointmentService.getAppointments();
    const doctorIds = appointments.map(appointment => appointment.drCode);
    this.doctorsWithAppointments = (await this.doctorsService.getDoctors()).filter(doctor => doctorIds.includes(doctor.id));
  }

  appointmentQuery = injectQuery(() => ({
    queryKey: ['appointments'],
    queryFn: () => this.appointmentService.getAppointments(),
  }));

  appointmentMutation = injectMutation((client) => ({
    mutationFn: (id: any) => this.appointmentService.deleteAppointment(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['appointments'] })
    },
  }));

  filterAppointmentsBySearch(appointments: any) {
    this.totalAppointment = appointments.length
    if (!this.searchQuery.trim()) {
      return appointments; // If search query is empty, return all appointments
    }
    const selectedAppointment = appointments.filter((appointment: any) =>
      this.doctorsService.getDoctorById(appointment?.drCode)?.drName?.toLowerCase()?.includes(this.searchQuery.toLowerCase()) ||
      this.departmentService.getDepartmentById(appointment?.departmentId)?.toLowerCase()?.includes(this.searchQuery.toLowerCase()) ||
      appointment?.pName?.toLowerCase()?.includes(this.searchQuery.toLowerCase()) ||
      appointment?.age?.includes(this.searchQuery) ||
      appointment?.sex?.toLowerCase()?.includes(this.searchQuery.toLowerCase()) ||
      appointment?.username?.toLowerCase()?.includes(this.searchQuery.toLowerCase()) ||
      appointment?.remarks?.toLowerCase()?.includes(this.searchQuery.toLowerCase())
    );
    this.totalAppointment = selectedAppointment.length;
    return selectedAppointment;
  }

  filterAppointmentsByDate(appointments: any): any {
    this.totalAppointment = appointments.length
    if (this.selectedDate == "") {
      return appointments; // If search query is empty, return all appointments
    }

    const selectedAppointment = appointments.filter((appointment: any) => appointment && appointment?.date?.includes(this.selectedDate));
    this.totalAppointment = selectedAppointment.length;
    return selectedAppointment;
  }

  filterAppointmentsByDoctor(appointments: any): any {
    this.totalAppointment = appointments.length
    if (this.selectedDoctor == "") {
      return appointments; // If search query is empty, return all appointments
    }

    const selectedAppointment = appointments.filter((appointment: any) => appointment && appointment.drCode == this.selectedDoctor);
    this.selectedDepartment = selectedAppointment[0]?.departmentId;
    this.totalAppointment = selectedAppointment.length;
    return selectedAppointment;
  }

  sortAppointments(appointments: any): any {
    this.totalAppointment = appointments.length
    if (appointments.length === 0) {
      return appointments;
    }

    return appointments.sort((a: any, b: any) => a.sl - b.sl);
  }

  onDelete(id: any) {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.appointmentMutation.mutate(id);
    }
  }

  transform(value: any, args?: any): any {
    if (!value) return null;

    const datePipe = new DatePipe('en-US');
    return datePipe.transform(value, 'dd/MM/yyyy');
  }

  openEditAppointmentModal(id: any) {
    this.selectedId = id;
    this.editAppointmentModal = true;
  }

  closeEditAppointmentModal() {
    this.editAppointmentModal = false;
  }

  // Function to print the page
  isPrinting: boolean = false;
  printPage() {
    this.isPrinting = true;
    setTimeout(() => {
      window.print();
      // Reset the printing state after printing is complete
      setTimeout(() => {
        this.isPrinting = false;
      }, 1000); // Adjust the delay as needed
    }, 100); // Adjust the delay as needed
  }

  ngOnDestroy(): void {
    this.appointmentSubscription?.unsubscribe();
  }
}
