import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { ImCross } from 'react-icons/im';
import { CommonModule } from '@angular/common';
import { ReactIconComponent } from '../../react-icon/react-icon.component';
import { DoctorsService } from '../../../../../services/serial/doctors.service';
import { ImgbbService } from '../../../../../services/serial/imgbb.service';
import { environment } from '../../../../../../environments/environments';
import { AuthService } from '../../../../../services/serial/auth.service';
import { DepartmentService } from '../../../../../services/serial/department.service';

@Component({
    selector: 'app-add-doctor-modal',
    standalone: true,
    templateUrl: './add-doctor-modal.component.html',
    styleUrl: './add-doctor-modal.component.css',
    imports: [CommonModule, ReactiveFormsModule, ReactIconComponent, FormsModule]
})
export class AddDoctorModalComponent {
  @Output() closeModal = new EventEmitter<void>();
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

  ImCross = ImCross;
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
      // Invalidate and refetch by using the client directly
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
    phone: [''],
    fee: [''],
    visitTime: [''],
    room: [''],
    description: [''],
    additional: [''],
    notice: [''],
    imageUrl: [''],
    serialBlock: [''],
    newPatientLimit: [''],
    oldPatientLimit: [''],
  });

  onSubmit(): void {
    const {drName, drSerial, degree, designation, specialty, departmentId, phone, fee, visitTime, room, description, additional, notice, serialBlock, newPatientLimit, oldPatientLimit, imageUrl } = this.addDoctorForm.value;
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
      formData.append('NewPatientLimit', newPatientLimit || '');
      formData.append('OldPatientLimit', oldPatientLimit || '');
      formData.append('Fee', fee != null ? fee.toString() : '');
      formData.append('ImageUrl', imageUrl || '');
      // const formData = {...this.addDoctorForm.value, "imageUrl":this.imageUrl, id: crypto.randomUUID()}
      this.mutation.mutate(formData);
      this.closeThisModal();
    }
    this.isSubmitted = true;
  }

  ngOnDestroy(): void {
    this.addDoctorSubscription?.unsubscribe();
  }
}
