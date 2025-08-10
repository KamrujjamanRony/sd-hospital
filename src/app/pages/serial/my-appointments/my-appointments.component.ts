import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, ChangeDetectorRef, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, forkJoin, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CoverComponent } from '../../../components/serial/shared/cover/cover.component';
import { AppointmentModalSerialComponent } from '../../../components/serial/shared/modal/appointment-modal-serial/appointment-modal-serial.component';
import { DoctorsService } from '../../../services/serial/doctors.service';
import { AuthService } from '../../../services/serial/auth.service';
import { DepartmentService } from '../../../services/serial/department.service';
import { AppointmentsService } from '../../../services/serial/appointments.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { JsonDataService } from '../../../services/main/json-data.service';
import { environment } from '../../../../environments/environments';

const BANGLA_FONT = {
  normal: environment.base64
};

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.css',
  imports: [CommonModule, CoverComponent, ReactiveFormsModule, FormsModule, AppointmentModalSerialComponent]
})
export class MyAppointmentsComponent {
  appointmentsService = inject(AppointmentsService);
  departmentService = inject(DepartmentService);
  doctorsService = inject(DoctorsService);
  private dataService = inject(JsonDataService);
  router = inject(Router);
  authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  user = signal<any>(null);
  emptyImg = signal<any>(null);
  selectedId = signal<any>(null);
  totalAppointment = signal<any>(null);
  addAppointmentModal = signal<boolean>(false);
  editAppointmentModal = signal<boolean>(false);
  private subscriptions: Subscription[] = [];
  searchQuery = signal<any>('');
  loading = signal<boolean>(false);

  fromDate = signal<any>(null);
  toDate = signal<any>(null);

  selectedDoctor = signal<any>('');
  selectedDepartment = signal<any>('');
  doctorsWithAppointments = signal<any>([]);
  typesWithAppointments = signal<any>([]);
  appointments = signal<any[]>([]);
  departments = signal<any[]>([]);
  filteredAppointments = signal<any[]>([]);
  header = signal<any>(null);

  ngOnInit(): void {
    const today = new Date();
    this.dataService.getHeader().subscribe(data => {
      this.header.set(data);
      console.log(data)
    });
    this.fromDate.set(today.toISOString().split('T')[0]);
    this.toDate.set(today.toISOString().split('T')[0]);
    this.user.set(this.authService.getUser());
    this.fetchAppointments();
    this.fetchDepartments();
  }

  onInputChange(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    this.loading.set(true);

    this.subscriptions.push(
      this.appointmentsService.getAppointmentData(this.fromDate(), this.toDate()).subscribe({
        next: (data) => {
          this.totalAppointment.set(data.length);
          if (this.totalAppointment() === 0) {
            this.loading.set(false);
            this.filteredAppointments.set([]);
            return;
          }
          this.appointments.set(data);

          const uniqueDrCodes = Array.from(new Set(data.map((appointment: any) => appointment?.drCode)));
          const doctorObservables = uniqueDrCodes.map(drCode =>
            this.doctorsService.getDoctorById(drCode).pipe(
              catchError((error) => {
                console.error(`Error fetching doctor with ID ${drCode}:`, error);
                return of({ drName: "Unknown Doctor" });
              })
            )
          );

          forkJoin(doctorObservables).subscribe({
            next: (doctorsData) => {
              this.doctorsWithAppointments.set(doctorsData.map((doctor, index) => ({
                id: uniqueDrCodes[index],
                drName: doctor?.drName || "Unknown Doctor",
              })));
              this.applyFilters();
              this.loading.set(false);
            },
            error: (error) => {
              console.error("Error fetching appointments data:", error);
              this.loading.set(false);
            }
          });
        },
        error: (error) => {
          console.error("Error fetching appointments:", error);
          this.loading.set(false);
        }
      })
    );
  }

  fetchDepartments(): void {
    this.departmentService.getDepartments().subscribe(departments => {
      this.departments.set(departments);
    })
  }

  applyFilters(): void {
    let filteredAppointments = this.appointments().sort((a, b) => a.sl - b.sl);
    if (this.user().username) {
      filteredAppointments = filteredAppointments.filter(
        (appointment) => appointment.username === this.user().username
      );
    }
    if (this.selectedDoctor()) {
      filteredAppointments = filteredAppointments.filter(
        (appointment) => appointment.drCode === this.selectedDoctor()
      );
    }
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filteredAppointments = filteredAppointments.filter(appointment =>
        (appointment.pName && appointment.pName.toLowerCase().includes(query)) ||
        (appointment.age && appointment.age.toString().includes(query)) ||
        (appointment.sex && appointment.sex.toLowerCase().includes(query)) ||
        (appointment.remarks && appointment.remarks.toLowerCase().includes(query)) ||
        (appointment.mobile && appointment.mobile.toString().includes(query)) ||
        (appointment.username && appointment.username.toLowerCase().includes(query))
      );
    }
    this.filteredAppointments.set(filteredAppointments);
    this.totalAppointment.set(this.filteredAppointments().length);
    this.loading.set(false);
  }

  getDoctorName(doctorId: string): string {
    const doctor = this.doctorsWithAppointments().find((d: { id: string; }) => d.id === doctorId);
    return doctor?.drName || 'Unknown Doctor';
  }

  getDepartmentName(departmentId: string): string {
    const department = this.departments().find((d: { id: string; }) => d.id === departmentId);
    return department?.departmentName || 'Unknown Department';
  }

  onDelete(id: any) {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.subscriptions.push(
        this.appointmentsService.deleteAppointmentData(id).subscribe({
          next: () => {
            this.fetchAppointments();
          },
          error: (error) => {
            console.error("Error deleting appointment:", error);
          }
        })
      );
    }
  }

  transform(value: any, args?: any): any {
    if (!value) return null;
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(value, 'dd/MM/yyyy');
  }

  checkRoles(roleId: any) {
    return this.user()?.roleIds?.find((role: any) => role == roleId);
  }

  openEditAppointmentModal(id: any) {
    this.selectedId.set(id);
    this.editAppointmentModal.set(true);
  }

  closeEditAppointmentModal() {
    this.editAppointmentModal.set(false);
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
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  generatePDF() {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'A4' });
    doc.addFileToVFS('Bangla-normal.ttf', BANGLA_FONT.normal);
    doc.addFont('Bangla-normal.ttf', 'Bangla', 'normal');
    const marginLeft = 10;
    const marginRight = 10;
    const marginBottom = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const centerX = doc.internal.pageSize.getWidth() / 2;
    let yPos = (this.header()?.marginTop | 0) + 10;

    // Header Section
    yPos = this.displayReportHeader(doc, yPos, centerX);
    // Title Section
    yPos = this.displayReportTitle(doc, yPos, centerX);
    // Render Table with custom column widths
    yPos = this.displayReportTable(doc, yPos, pageWidth, pageHeight, marginLeft, marginRight, marginBottom);

    const pdfOutput = doc.output('blob');
    window.open(URL.createObjectURL(pdfOutput));
  }

  displayReportHeader(doc: jsPDF, yPos: number, centerX: number): any {
    if (this.header()?.name) {
      // Set Bangla as default font
      doc.setFont('Bangla');
      doc.setFontSize(18);
      doc.text(this.header()?.name, centerX, yPos, { align: 'center' });
      yPos += 2;
    }

    if (this.header()?.address) {
      yPos += 3;
      // Set Bangla as default font
      doc.setFont('Bangla');
      doc.setFontSize(12);
      doc.text(this.header()?.address, centerX, yPos, { align: 'center' });
      yPos += 2;
    }

    if (this.header()?.contact) {
      yPos += 3;
      // Set Bangla as default font
      doc.setFont('Bangla');
      doc.setFontSize(12);
      doc.text(`Contact: ${this.header()?.contact}`, centerX, yPos, { align: 'center' });
      yPos += 2;
    }
    doc.line(0, yPos, 560, yPos);
    yPos += 5;

    return yPos;
  }

  displayReportTitle(doc: jsPDF, yPos: number, centerX: number): any {
    // Set Bangla as default font
    doc.setFont('Bangla');
    doc.setFontSize(14);
    doc.text(`Appointment List`, centerX, yPos, { align: 'center' });
    yPos += 5;

    // Sub-header for doctor name and dates
    doc.setFontSize(10);
    if (this.selectedDoctor()) {
      doc.text(`Doctor Name: ${this.getDoctorName(this.selectedDoctor())}`, centerX, yPos, { align: 'center' });
      yPos += 5;
    }
    if (this.selectedDepartment()) {
      doc.text(`Department Name: ${this.getDepartmentName(this.selectedDepartment())}`, centerX, yPos, { align: 'center' });
      yPos += 5;
    }
    if (this.fromDate()) {
      const dateRange = `From: ${this.transform(this.fromDate())} to: ${this.toDate() ? this.transform(this.toDate()) : this.transform(this.fromDate())
        }`;
      doc.text(dateRange, centerX, yPos, { align: 'center' });
    }

    return yPos;
  }

  displayReportTable(doc: jsPDF, yPos: number, pageWidth: number, pageHeight: number, marginLeft: number, marginRight: number, marginBottom: number): any {
    // Prepare Table Data
    const dataRows = this.filteredAppointments().map((data: any) => [
      data?.sl || '',
      data?.pName || '',
      data?.age || '',
      data?.sex || '',
      data?.mobile || '',
      data?.remarks || '',
    ]);

    // Render Table
    autoTable(doc, {
      head: [['SL', 'PATIENT NAME', 'AGE', 'SEX', 'MOBILE', 'REMARKS']],
      body: dataRows,
      theme: 'grid',
      startY: yPos + 2,
      styles: {
        font: 'Bangla',
        textColor: 0,
        cellPadding: 2,
        lineColor: 0,
        fontSize: 8,
        valign: 'middle',
        halign: 'center',
      },
      headStyles: {
        fillColor: [102, 255, 102],
        textColor: 0,
        lineWidth: 0.2,
        lineColor: 0,
        fontStyle: 'bold',
      },
      margin: { top: yPos, left: marginLeft, right: marginRight },
    });

    return yPos;
  }
}