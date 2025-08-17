import { Component, Input, inject, output, signal } from '@angular/core';
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
  departmentName = signal("");

  closeDoctorModal(): void {
    this.closeDoctorDetails.emit();
  }
  showAppointmentModal(): void {
    this.handleClick.emit();
  }

  ngOnInit() {
    this.departmentService.getDepartmentById(this.doctor?.departmentId).subscribe(data => {
      console.log(data?.departmentName);
      this.departmentName.set(data?.departmentName)
    });

  }

  getDepartmentName(departmentId: any) {
    let departmentName;
    this.departmentService.getDepartmentById(departmentId).subscribe(data => {
      console.log(data?.departmentName);
      departmentName = data?.departmentName
    });
    return departmentName;
  }

}
