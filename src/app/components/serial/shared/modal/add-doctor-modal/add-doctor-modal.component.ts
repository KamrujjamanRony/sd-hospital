import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DoctorsService } from '../../../../../services/serial/doctors.service';
import { environment } from '../../../../../../environments/environments';
import { AuthService } from '../../../../../services/serial/auth.service';
import { DepartmentService } from '../../../../../services/serial/department.service';

@Component({
    selector: 'app-add-doctor-modal',
    templateUrl: './add-doctor-modal.component.html',
    styleUrl: './add-doctor-modal.component.css',
    imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class AddDoctorModalComponent {
  readonly closeModal = output<void>();
  doctorsService = inject(DoctorsService);
  departmentService = inject(DepartmentService)
  authService = inject(AuthService);
  user: any;
  fb = inject(FormBuilder);
  queryClient = injectQueryClient();
  private addDoctorSubscription?: Subscription;

  closeThisModal(): void {
    this.closeModal.emit();
  }
  isSubmitted = false;

  constructor(){}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  checkRoles(roleId: any) {
    const result = this.user?.roleIds?.find((role: any) => role == roleId)
    return result;
  }

  query = injectQuery(() => ({
    queryKey: ['departments'],
    queryFn: () => this.departmentService.getDepartments(),
  }));

  mutation = injectMutation((client) => ({
    mutationFn: (formData: any) => this.doctorsService.addDoctor(formData),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['doctors'] })
    },
  }));

  addDoctorForm = this.fb.group({
    companyID: [environment.hospitalCode, Validators.required],
    drSerial: [''],
    drName: ['', Validators.required],
    degree: [''],
    designation: [''],
    specialty: [''],
    departmentId: ['', Validators.required],
    phone: ['', Validators.maxLength(14)],
    fee: [''],
    visitTime: [''],
    room: [''],
    description: [''],
    additional: [''],
    notice: [''],
    imageUrl: [''],
    serialBlock: [''],
    satNewPatientLimit: [''],
    satOldPatientLimit: [''],
    sunNewPatientLimit: [''],
    sunOldPatientLimit: [''],
    monNewPatientLimit: [''],
    monOldPatientLimit: [''],
    tueNewPatientLimit: [''],
    tueOldPatientLimit: [''],
    wedNewPatientLimit: [''],
    wedOldPatientLimit: [''],
    thuNewPatientLimit: [''],
    thuOldPatientLimit: [''],
    friNewPatientLimit: [''],
    friOldPatientLimit: [''],
  });

  onSubmit(): void {
    const {drName, drSerial, degree, designation, specialty, departmentId, phone, fee, visitTime, room, description, additional, notice, serialBlock, satNewPatientLimit, satOldPatientLimit, sunNewPatientLimit, sunOldPatientLimit, monNewPatientLimit, monOldPatientLimit, tueNewPatientLimit, tueOldPatientLimit, wedNewPatientLimit, wedOldPatientLimit, thuNewPatientLimit, thuOldPatientLimit, friNewPatientLimit, friOldPatientLimit, imageUrl } = this.addDoctorForm.value;
    if (drName && departmentId) {
      
      const formData = new FormData();

      formData.append('CompanyID', environment.hospitalCode.toString());
      formData.append('DrSerial', drSerial != null ? drSerial.toString() : '');
      formData.append('DrName', drName);
      formData.append('Degree', degree != null ? degree.toString() : '');
      formData.append('Designation', designation != null ? designation.toString() : '');
      formData.append('Specialty', specialty != null ? specialty.toString() : '');
      formData.append('DepartmentId', departmentId);
      formData.append('Phone', phone != null ? phone.toString() : '');
      formData.append('VisitTime', visitTime != null ? visitTime.toString() : '');
      formData.append('Room', room != null ? room.toString() : '');
      formData.append('Description', description != null ? description.toString() : '');
      formData.append('Additional', additional != null ? additional.toString() : '');
      formData.append('Notice', notice != null ? notice.toString() : '');
      formData.append('SerialBlock', serialBlock != null ? serialBlock.toString() : '');
      formData.append('SatNewPatientLimit', satNewPatientLimit || '');
      formData.append('SatOldPatientLimit', satOldPatientLimit || '');
      formData.append('SunNewPatientLimit', sunNewPatientLimit || '');
      formData.append('SunOldPatientLimit', sunOldPatientLimit || '');
      formData.append('MonNewPatientLimit', monNewPatientLimit || '');
      formData.append('MonOldPatientLimit', monOldPatientLimit || '');
      formData.append('TueNewPatientLimit', tueNewPatientLimit || '');
      formData.append('TueOldPatientLimit', tueOldPatientLimit || '');
      formData.append('WedNewPatientLimit', wedNewPatientLimit || '');
      formData.append('WedOldPatientLimit', wedOldPatientLimit || '');
      formData.append('ThuNewPatientLimit', thuNewPatientLimit || '');
      formData.append('ThuOldPatientLimit', thuOldPatientLimit || '');
      formData.append('FriNewPatientLimit', friNewPatientLimit || '');
      formData.append('FriOldPatientLimit', friOldPatientLimit || '');
      formData.append('Fee', fee != null ? fee.toString() : '');
      formData.append('ImageUrl', imageUrl || '');
      this.mutation.mutate(formData);
      this.closeThisModal();
    }
    this.isSubmitted = true;
  }

  ngOnDestroy(): void {
    this.addDoctorSubscription?.unsubscribe();
  }
}
