import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { format, isBefore } from 'date-fns';
import { CommonModule } from '@angular/common';
import { ReactIconComponent } from '../../../components/serial/shared/react-icon/react-icon.component';
import { ConfirmModalComponent } from '../../../components/serial/shared/modal/confirm-modal/confirm-modal.component';
import { NavbarComponent } from '../../../components/serial/shared/navbar/navbar.component';
import { ToastService } from '../../../services/serial/toast.service';
import { AppointmentService } from '../../../services/serial/appointment.service';
import { DoctorsService } from '../../../services/serial/doctors.service';
import { AuthService } from '../../../services/serial/auth.service';
import { environment } from '../../../../environments/environments';
import { DepartmentService } from '../../../services/serial/department.service';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css',
  imports: [CommonModule, ReactiveFormsModule, ReactIconComponent, ConfirmModalComponent, NavbarComponent, FormsModule]
})
export class AppointmentFormComponent implements OnInit {
  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  appointmentService = inject(AppointmentService);
  departmentService = inject(DepartmentService);
  doctorsService = inject(DoctorsService);
  authService = inject(AuthService);
  doctorList: any;
  format = format;
  isSubmitted = false;
  selected!: any;
  user: any;
  blockSerials: any;
  msg: any;
  confirm!: any;

  confirmModal!: boolean;


  @Output() closeAppointment = new EventEmitter<void>();

  closeAppointmentModal(): void {
    this.closeAppointment.emit();
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.getConfirm()
    // Update the form group after this.confirm is set
    this.updateFormGroup();
  }

  checkRoles(roleId: any) {
    const result = this.user?.roleIds?.find((role: any) => role == roleId)
    return result;
  }

  // Method to update the form group
  updateFormGroup(): void {
    this.appointmentForm.patchValue({
      confirmed: this.confirm
    });
  }

  closeModal() {
    this.confirmModal = false;
    this.msg = null;
  }

  getConfirm() {
    // if (this.user?.roleIds?.find((role: any) => role == "c90aed50-ad56-431b-afa4-c36e8cac039a")) {
    //   this.confirm = true
    // } else {
    //   this.confirm = false
    // }
    this.confirm = false;
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
      // Invalidate and refetch by using the client directly
      client.invalidateQueries({ queryKey: ['appointments'] })
    },
    onError: (error: any) => {
      this.handleError(error); // Handle the error
      setTimeout(() => {
        this.closeAppointmentModal();
      }, 2000);
    }
  }));

  private handleError(error: any) {
    // console.log(error?.response?.data?.message);
    this.msg = error?.response?.data?.message;
    console.error(error);
  }

  async onDepartmentChange() {
    this.doctorList = await this.doctorsService.filterDoctorsByDepartment(this.appointmentForm.value.departmentId);
  }

  onDoctorChange() {
    this.selected = this.doctorsService.getDoctorById(this.appointmentForm.value.drCode);
    this.blockSerials = this.selected?.serialBlock?.split(',');
    this.updateFormValues();
  }

  appointmentForm = this.fb.group({
    companyID: environment.hospitalCode,
    pName: ['', Validators.required],
    age: [''],
    sex: [''],
    mobile: [''],
    type: ["true"],
    date: ['', Validators.required],
    sL: "",
    departmentId: "",
    drCode: '',
    fee: '',
    remarks: '',
    paymentStatus: false,
    confirmed: this.confirm,
  })

  updateFormValues(): void {
    if (this.selected) {
      this.appointmentForm.patchValue({
        departmentId: this.selected.departmentId,
        fee: this.selected.fee,
      });
    }
  }

  onSubmit(): void {
    const { pName, age, sex, date, type, departmentId, sL, drCode, fee, remarks, paymentStatus, confirmed, mobile } = this.appointmentForm.value;
    if (drCode && pName && type && date) {
      // console.log('submitted form', this.appointmentForm.value);
      // const formData = { ...this.appointmentForm.value, id: crypto.randomUUID() }
      const formData = new FormData();

      formData.append('CompanyID', environment.hospitalCode.toString());
      formData.append('Date', date);
      formData.append('DepartmentId', departmentId != null ? departmentId.toString() : '');
      formData.append('SL', sL != null ? sL.toString() : '');
      formData.append('Type', type || '');
      formData.append('DrCode', drCode != null ? drCode.toString() : '');
      formData.append('PName', pName);
      formData.append('Age', age || '');
      formData.append('Sex', sex || '');
      formData.append('Mobile', mobile || '');
      formData.append('Fee', fee != null ? fee.toString() : '');
      formData.append('Username', this.user.username);
      formData.append('Remarks', remarks || '');
      formData.append('PaymentStatus', paymentStatus != null ? paymentStatus.toString() : '');
      formData.append('Confirmed', confirmed != null ? confirmed.toString() : this.confirm);
      this.appointmentMutation.mutate(formData);
      // toast
      this.msg = "Appointment is successfully added!";
      this.isSubmitted = true;
    } else {
      this.msg = "Please fill all required fields!";
      this.isSubmitted = true;
    }
  }

  toggleSelection(): void {
    const currentValue = this.appointmentForm.get('type')?.value;
    const newValue = currentValue === 'false' ? 'true' : 'false';
    this.appointmentForm.get('type')?.setValue(newValue);
    console.log(this.appointmentForm.get('type')?.value)
  }

  dates: Date[] = Array.from({ length: 15 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Define the isPastDate method
  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today);
  }

  formReset(): void {
    this.appointmentForm.reset({
      companyID: environment.hospitalCode,
      pName: '',
      age: '',
      sex: '',
      mobile: '',
      type: "true",
      date: '',
      sL: "",
      departmentId: "",
      drCode: '',
      fee: '',
      remarks: '',
      paymentStatus: false,
      confirmed: this.confirm
    });
  }

}
