import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoverComponent } from '../../../shared/cover/cover.component';
import { ConfirmModalComponent } from '../../../shared/modals/confirm-modal/confirm-modal.component';
import { DoctorsService } from '../../../../features/services/main/doctors.service';
import { ImgbbService } from '../../../../features/services/main/imgbb.service';
import { environment } from '../../../../../environments/environments';

@Component({
    selector: 'app-add-doctor',
    standalone: true,
    templateUrl: './add-doctor.component.html',
    imports: [CommonModule, FormsModule, CoverComponent, ConfirmModalComponent]
})
export class AddDoctorComponent {
  yourTitle: any = 'add a doctor';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Add Doctor';

  model: any;
  private addDoctorSubscription?: Subscription;
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  constructor(private doctorsService: DoctorsService, private imgbbService: ImgbbService) {
    this.model = {
      companyID: environment.hospitalCode,
      drSerial: null,
      drName: '',
      degree: '',
      designation: '',
      specialty: '',
      department: '',
      phone: '',
      visitTime: '',
      room: '',
      description: '',
      additional: '',
      notice: '',
      imageUrl: '',
      serialBlock: '',
    }
  }


  onFormSubmit(): void {
    const formData = new FormData();

    formData.append('CompanyID', this.model.companyID);
    formData.append('DrSerial', this.model.drSerial);
    formData.append('DrName', this.model.drName);
    formData.append('Degree', this.model.degree);
    formData.append('Designation', this.model.designation);
    formData.append('Specialty', this.model.specialty);
    formData.append('Department', this.model.department);
    formData.append('Phone', this.model.phone);
    formData.append('VisitTime', this.model.visitTime);
    formData.append('Room', this.model.room);
    formData.append('Description', this.model.description);
    formData.append('Additional', this.model.additional);
    formData.append('Notice', this.model.notice);
    formData.append('ImageUrl', this.model.imageUrl);
    formData.append('SerialBlock', this.model.serialBlock);

    this.addDoctorSubscription = this.doctorsService.addDoctor(formData)
      .subscribe({
        next: (response) => {
          // toast
          this.confirmModal = true;
        },
        error: (error) => {
          console.error('Error adding doctor:', error);
        }
      })
  }

  ngOnDestroy(): void {
    this.addDoctorSubscription?.unsubscribe();
  }

}
