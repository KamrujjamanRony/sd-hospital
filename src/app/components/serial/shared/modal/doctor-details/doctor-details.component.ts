import { Component, Input, inject, output } from '@angular/core';
import { DepartmentService } from '../../../../../services/serial/department.service';

@Component({
  selector: 'app-doctor-details',
  imports: [],
  templateUrl: './doctor-details.component.html'
})
export class DoctorDetailsComponent {
  @Input() doctor: any;
  readonly closeDoctorDetails = output<void>();
  readonly handleClick = output<void>();
  departmentService = inject(DepartmentService);

  closeDoctorModal(): void {
    this.closeDoctorDetails.emit();
  }
  showAppointmentModal(): void {
    this.handleClick.emit();
  }

}
