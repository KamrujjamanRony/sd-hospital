import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../../../components/main/shared/all-modals/confirm-modal/confirm-modal.component';
import { DoctorsService } from '../../../../../services/main/doctors.service';
import { ImgbbService } from '../../../../../services/main/imgbb.service';

@Component({
    selector: 'app-edit-doctor',
    standalone: true,
    templateUrl: './edit-doctor.component.html',
    imports: [CoverComponent, CommonModule, FormsModule, ConfirmModalComponent]
})
export class EditDoctorComponent {
  imgbbService = inject(ImgbbService);
  doctorsService = inject(DoctorsService);
  route = inject(ActivatedRoute);
  
  id: any | null = null;
  doctorInfo?: any;
  paramsSubscription?: Subscription;
  editDoctorSubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor() { }
  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if (this.id) {
          this.doctorsService.getDoctor(this.id)
            .subscribe({
              next: (response) => {
                this.doctorInfo = response;
              }
            });
        }
      }
    });
  }

  onFormSubmit(): void {
    const formData = new FormData();

    formData.append('CompanyID', this.doctorInfo.companyID);
    formData.append('DrSerial', this.doctorInfo.drSerial);
    formData.append('DrName', this.doctorInfo.drName);
    formData.append('Degree', this.doctorInfo.degree);
    formData.append('Designation', this.doctorInfo.designation);
    formData.append('Specialty', this.doctorInfo.specialty);
    formData.append('Department', this.doctorInfo.department);
    formData.append('Phone', this.doctorInfo.phone);
    formData.append('VisitTime', this.doctorInfo.visitTime);
    formData.append('Room', this.doctorInfo.room);
    formData.append('Description', this.doctorInfo.description);
    formData.append('Additional', this.doctorInfo.additional);
    formData.append('Notice', this.doctorInfo.notice);
    formData.append('ImageUrl', this.doctorInfo.imageUrl);
    formData.append('SerialBlock', this.doctorInfo.serialBlock);

    if (this.id) {
      this.editDoctorSubscription = this.doctorsService.updateDoctor(this.id, formData)
        .subscribe({
          next: (response) => {
            // toast
            this.confirmModal = true;
          }
        });
    }
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editDoctorSubscription?.unsubscribe();
  }

}
