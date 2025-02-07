import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { DoctorsService } from '../../../../../services/serial/doctors.service';
import { ImgbbService } from '../../../../../services/serial/imgbb.service';
import { environment } from '../../../../../../environments/environments';
import { AuthService } from '../../../../../services/serial/auth.service';
import { DepartmentService } from '../../../../../services/serial/department.service';

@Component({
    selector: 'app-edit-doctor-modal',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './edit-doctor-modal.component.html',
    styleUrl: './edit-doctor-modal.component.css'
})
export class EditDoctorModalComponent {
  readonly id = input.required<any>();
  readonly closeModal = output<void>();
  doctorsService = inject(DoctorsService);
  departmentService = inject(DepartmentService)
  imgbbService = inject(ImgbbService);
  authService = inject(AuthService);
  user: any;
  fb = inject(FormBuilder);
  queryClient = injectQueryClient();
  selected!: any;
  private editDoctorSubscription?: Subscription;

  closeThisModal(): void {
    this.closeModal.emit();
  }


  isSubmitted = false;

  constructor(){}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    const doctors = this.queryClient.getQueryData(['doctors']) as any[];
    this.selected = doctors?.find((d) => d.id == this.id());
    this.updateFormValues();
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
    mutationFn: (updateData: any) => this.doctorsService.updateDoctor(this.selected.id, updateData),
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
    imageUrl: [''],
    specialty: [''],
    departmentId: ['', Validators.required],
    phone: [''],
    fee: [''],
    visitTime: [''],
    room: [''],
    description: [''],
    additional: [''],
    notice: [''],
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

  updateFormValues(): void {
    if (this.selected) {
      this.addDoctorForm.patchValue({
        companyID: this.selected?.companyID,
        drSerial: this.selected?.drSerial,
        drName: this.selected?.drName,
        degree: this.selected?.degree,
        imageUrl: this.selected?.imageUrl,
        designation: this.selected?.designation,
        specialty: this.selected?.specialty,
        departmentId: this.selected?.departmentId,
        phone: this.selected?.phone,
        fee: this.selected?.fee || 0,
        visitTime: this.selected?.visitTime,
        room: this.selected?.room,
        description: this.selected?.description,
        additional: this.selected?.additional,
        notice: this.selected?.notice,
        serialBlock: this.selected?.serialBlock,
        satNewPatientLimit: this.selected?.satNewPatientLimit,
        satOldPatientLimit: this.selected?.satOldPatientLimit,
        sunNewPatientLimit: this.selected?.sunNewPatientLimit,
        sunOldPatientLimit: this.selected?.sunOldPatientLimit,
        monNewPatientLimit: this.selected?.monNewPatientLimit,
        monOldPatientLimit: this.selected?.monOldPatientLimit,
        tueNewPatientLimit: this.selected?.tueNewPatientLimit,
        tueOldPatientLimit: this.selected?.tueOldPatientLimit,
        wedNewPatientLimit: this.selected?.wedNewPatientLimit,
        wedOldPatientLimit: this.selected?.wedOldPatientLimit,
        thuNewPatientLimit: this.selected?.thuNewPatientLimit,
        thuOldPatientLimit: this.selected?.thuOldPatientLimit,
        friNewPatientLimit: this.selected?.friNewPatientLimit,
        friOldPatientLimit: this.selected?.friOldPatientLimit
      });
    }
  }

  onSubmit(): void {
    const {drName, drSerial, degree, designation, specialty, departmentId, phone, fee, visitTime, room, description, additional, notice, serialBlock,satNewPatientLimit, satOldPatientLimit, sunNewPatientLimit, sunOldPatientLimit, monNewPatientLimit, monOldPatientLimit, tueNewPatientLimit, tueOldPatientLimit, wedNewPatientLimit, wedOldPatientLimit, thuNewPatientLimit, thuOldPatientLimit, friNewPatientLimit, friOldPatientLimit, imageUrl } = this.addDoctorForm.value;
    if (drName && departmentId) {
      const formData = new FormData();

      formData.append('CompanyID', environment.hospitalCode.toString());
      formData.append('DrSerial', drSerial || '');
      formData.append('DrName', drName);
      formData.append('Degree', degree || '');
      formData.append('Designation', designation || '');
      formData.append('Specialty', specialty || '');
      formData.append('DepartmentId', departmentId);
      formData.append('Phone', phone || '');
      formData.append('VisitTime', visitTime || '');
      formData.append('Room', room || '');
      formData.append('Description', description || '');
      formData.append('Additional', additional || '');
      formData.append('Notice', notice || '');
      formData.append('SerialBlock', serialBlock || '');
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
      formData.append('Fee', fee || '');
      formData.append('ImageUrl', imageUrl || '');
      this.mutation.mutate(formData);
      this.closeThisModal();
    }
    this.isSubmitted = true;
  }

  ngOnDestroy(): void {
    this.editDoctorSubscription?.unsubscribe();
  }

}
