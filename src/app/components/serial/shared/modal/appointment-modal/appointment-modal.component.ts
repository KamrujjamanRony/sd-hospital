import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { format, isBefore } from 'date-fns';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ToastService } from '../../../../../services/serial/toast.service';
import { AppointmentService } from '../../../../../services/serial/appointment.service';
import { DoctorsService } from '../../../../../services/serial/doctors.service';
import { AuthService } from '../../../../../services/serial/auth.service';
import { environment } from '../../../../../../environments/environments';
import { DepartmentService } from '../../../../../services/serial/department.service';
import { AppointmentsService } from '../../../../../services/serial/appointments.service';

@Component({
  selector: 'app-appointment-modal',
  standalone: true,
  templateUrl: './appointment-modal.component.html',
  styleUrl: './appointment-modal.component.css',
  providers: [DatePipe],
  imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent]
})
export class AppointmentModalComponent {
  datePipe = inject(DatePipe);
  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  appointmentService = inject(AppointmentService);
  appointmentsService = inject(AppointmentsService);
  departmentService = inject(DepartmentService);
  doctorsService = inject(DoctorsService);
  authService = inject(AuthService);
  user: any;
  blockSerials: any;
  msg: any;
  err: any;
  @Input() doctor: any;
  @Input() id!: any;
  @Output() closeAppointment = new EventEmitter<void>();

  closeAppointmentModal(): void {
    this.closeAppointment.emit();
  }

  format = format;
  isSubmitted = false;
  selected!: any;
  selectedDoctor: any;
  doctorList: any;
  confirmModal: boolean = false;

  constructor(){}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (this.id) {
      this.appointmentsService.getAppointmentDataById(this.id).subscribe(data => {
        this.selected = data;
        this.updateFormValues();
        this.blockSerials = this.doctor?.serialBlock?.split(',');
      });
    }
    if (this.doctor) {
      this.blockSerials = this.doctor?.serialBlock?.split(',');
    }
  }

  checkRoles(roleId: any) {
    const result = this.user?.roleIds?.find((role: any) => role == roleId)
    return result;
  }

  closeModal() {
    this.confirmModal = false;
    this.err = null;
  }

  departmentQuery = injectQuery(() => ({
    queryKey: ['departments'],
    queryFn: () => this.departmentService.getDepartments(),
  }));

  doctorQuery = injectQuery(() => ({
    queryKey: ['doctors'],
    queryFn: () => this.doctorsService.getDoctors(),
  }));

  appointmentMutation = injectMutation((client) => ({
    mutationFn: (formData: any) => this.appointmentService.addAppointment(formData),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['appointments'] });
      this.msg = "Appointment is successfully added!"
      this.confirmModal = true;
      setTimeout(() => {
        this.closeAppointmentModal();
      }, 2000);
    },
    onError: (error: any) => {
      this.handleError(error);
    }
  }));

  UpdateAppointmentMutation = injectMutation((client) => ({
    mutationFn: (formData: any) => this.appointmentService.updateAppointment(this.selected.id, formData),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['appointments'] });
      this.msg = "Appointment is successfully updated!"
      this.confirmModal = true;
      setTimeout(() => {
        this.closeAppointmentModal();
      }, 2000);
    },
    onError: (error: any) => {
      this.handleError(error);
      setTimeout(() => {
        this.closeAppointmentModal();
      }, 2000);
    }
  }));

  private handleError(error: any) {
    this.err = error?.response?.data?.message;
    console.error(error);
  }

  async onDepartmentChange() {
    this.doctorList = await this.doctorsService.filterDoctorsByDepartment(this.appointmentForm.value.departmentId);
  }

  onDoctorChange() {
    this.selectedDoctor = this.doctorsService.getDoctorById(this.appointmentForm.value.drCode);
    this.blockSerials = this.selectedDoctor?.serialBlock?.split(',');
    this.updateForm();
  }

  appointmentForm = this.fb.group({
    companyID: [environment.hospitalCode],
    pName: ['', Validators.required],
    age: [''],
    mobile: [''],
    sex: [''],
    type: ['true'],
    date: ['', Validators.required],
    sL: [''],
    departmentId: [''],
    drCode: [''],
    fee: [''],
    remarks: '',
    paymentStatus: [false],
    confirmed: [false],
  })

  updateFormValues(): void {
    if (this.selected) {
  
      const formattedDate = this.datePipe.transform(this.selected.date, 'yyyy-MM-dd');
  
      this.appointmentForm.patchValue({
        pName: this.selected.pName,
        age: this.selected.age,
        sex: this.selected.sex,
        mobile: this.selected.mobile,
        type: this.selected.type.toString(),
        date: formattedDate,
        sL: this.selected.sl,
        departmentId: this.selected.departmentId,
        drCode: this.selected.drCode,
        fee: this.selected.fee,
        remarks: this.selected.remarks,
        paymentStatus: this.selected.paymentStatus,
        confirmed: this.selected.confirmed,
      });
    }
  }

  updateForm(): void {
    if (this.selectedDoctor) {
      this.appointmentForm.patchValue({
        departmentId: this.selectedDoctor.departmentId,
        fee: this.selectedDoctor.fee,
      });
      this.blockSerials = this.selectedDoctor?.serialBlock?.split(',');
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;
    const { pName, age, sex, date, sL, type, departmentId, drCode, fee, remarks, paymentStatus, confirmed, mobile } = this.appointmentForm.value;

    if (pName && date) {
      if (!this.selected) {
        const formData = new FormData();

        formData.append('CompanyID', environment.hospitalCode.toString() || '');
        formData.append('Date', date || '');
        formData.append('DepartmentId', this.doctor.departmentId || '');
        formData.append('SL', sL || '');
        formData.append('Type', type != null ? type.toString() : '');
        formData.append('DrCode', this.doctor.id || '');
        formData.append('PName', pName || '');
        formData.append('Age', age || '');
        formData.append('Sex', sex || '');
        formData.append('Mobile', mobile || '');
        formData.append('Fee', this.doctor.fee || '');
        formData.append('Remarks', remarks || '');
        formData.append('Username', this.user.username || '');
        formData.append('PaymentStatus', paymentStatus != null ? paymentStatus.toString() : '');
        formData.append('Confirmed', confirmed != null ? confirmed.toString() : '');

        this.appointmentMutation.mutate(formData);
        this.isSubmitted = false;
      } else {
        const formData = new FormData();

        formData.append('CompanyID', environment.hospitalCode.toString());
        formData.append('Date', date);
        formData.append('DepartmentId', departmentId != null ? departmentId.toString() : '');
        if (this.selected.sl !== sL) {
          formData.append('SL', sL != null ? sL.toString() : '');
        }
        formData.append('Type', type != null ? type.toString() : '');
        formData.append('DrCode', drCode != null ? drCode.toString() : '');
        formData.append('PName', pName);
        formData.append('Age', age || '');
        formData.append('Sex', sex || '');
        formData.append('Mobile', mobile || '');
        formData.append('Fee', fee != null ? fee.toString() : '');
        formData.append('Remarks', remarks || '');
        formData.append('Username', this.user.username);
        formData.append('PaymentStatus', paymentStatus != null ? paymentStatus.toString() : '');
        formData.append('Confirmed', confirmed != null ? confirmed.toString() : '');

        this.UpdateAppointmentMutation.mutate(formData);
        this.isSubmitted = false;
      }
    }
  }

  toggleSelection(): void {
    const currentValue = this.appointmentForm.get('type')?.value;
    const newValue = currentValue === 'false' ? 'true' : 'false';
    this.appointmentForm.get('type')?.setValue(newValue);
  }

  dates: Date[] = Array.from({ length: 15 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });


  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today);
  }
  

}
