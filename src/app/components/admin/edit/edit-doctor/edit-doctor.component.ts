import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoverComponent } from '../../../shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';
import { DoctorsService } from '../../../../features/services/doctors.service';
import { ImgbbService } from '../../../../features/services/imgbb.service';

@Component({
    selector: 'app-edit-doctor',
    standalone: true,
    templateUrl: './edit-doctor.component.html',
    imports: [CoverComponent, CommonModule, FormsModule, ConfirmModalComponent]
})
export class EditDoctorComponent {
  yourTitle: any = 'Update Doctor information';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Edit Doctor';
  id: any | null = null;
  doctorInfo?: any;
  paramsSubscription?: Subscription;
  editDoctorSubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor(private route: ActivatedRoute, private doctorsService: DoctorsService, private imgbbService: ImgbbService) { }
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
