import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CoverComponent } from '../../../components/serial/shared/cover/cover.component';
import { AppointmentModalComponent } from '../../../components/serial/shared/modal/appointment-modal/appointment-modal.component';
import { AppointmentService } from '../../../services/serial/appointment.service';
import { DoctorsService } from '../../../services/serial/doctors.service';
import { DepartmentService } from '../../../services/serial/department.service';

@Component({
  selector: 'app-print-appointment',
  standalone: true,
  imports: [CoverComponent, AppointmentModalComponent, FormsModule],
  templateUrl: './print-appointment.component.html',
  styleUrl: './print-appointment.component.css'
})
export class PrintAppointmentComponent {
  appointmentService = inject(AppointmentService);
  departmentService = inject(DepartmentService);
  doctorsService = inject(DoctorsService);
  router = inject(Router);
  queryClient = injectQueryClient();
  emptyImg: any;
  selectedId: any;
  addAppointmentModal: boolean = false;
  editAppointmentModal: boolean = false;
  private appointmentSubscription?: Subscription;
  searchQuery: string = '';
  
  selectedDoctor: string = '';
  doctorsWithAppointments: any = [];

  constructor() {}

  ngOnInit(): void {
    this.getDoctorsWithAppointments();
    this.printPage();
  }

  redirectToHome(): void {
    this.router.navigateByUrl('/');
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
    if (!this.searchQuery.trim()) {
      return appointments; // If search query is empty, return all appointments
    }
    const selectedAppointment = appointments.filter((appointment: any) =>
      this.doctorsService.getDoctorById(appointment?.drCode)?.drName?.toLowerCase()?.includes(this.searchQuery.toLowerCase()) ||
      this.departmentService.getDepartmentById(appointment?.departmentId)?.departmentName?.includes(this.searchQuery.toLowerCase()) ||
      appointment?.pName?.toLowerCase()?.includes(this.searchQuery.toLowerCase()) ||
      appointment?.age?.includes(this.searchQuery) ||
      appointment?.sex?.toLowerCase()?.includes(this.searchQuery.toLowerCase()) ||
      appointment?.username?.toLowerCase()?.includes(this.searchQuery.toLowerCase()) ||
      appointment?.remarks?.toLowerCase()?.includes(this.searchQuery.toLowerCase())
    );
    return selectedAppointment;
  }

  filterAppointmentsByDoctor(appointments: any): any {
    if (this.selectedDoctor == "") {
      return appointments; // If search query is empty, return all appointments
    }

    const selectedAppointment = appointments.filter((appointment: { drCode: any; }) =>
      appointment && appointment.drCode == this.selectedDoctor
    );
    return selectedAppointment;
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
    
    // Delay before printing
    setTimeout(() => {
      window.print();
      
      // Delay after printing before resetting the printing state
      setTimeout(() => {
        this.isPrinting = false;
        this.router.navigateByUrl('/all-appointment');
      }, 500); // Adjust the delay as needed
    }, 100); // Adjust the delay as needed
  }
  

  ngOnDestroy(): void {
    this.appointmentSubscription?.unsubscribe();
  }

}
