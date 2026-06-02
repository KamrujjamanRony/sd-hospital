import { Component, Input, inject, output, signal, computed } from '@angular/core';
import { AppStore } from '../../../../../store/app.store';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [],
  templateUrl: './doctor-details.component.html'
})
export class DoctorDetailsComponent {
  @Input() doctor: any;
  readonly closeDoctorDetails = output<void>();
  readonly handleClick = output<void>(); // This emits when appointment button is clicked

  store = inject(AppStore);

  departmentName = computed(() => {
    if (!this.doctor?.departmentId) return '';

    const departments = this.store.departments();
    const department = departments.find(dept => dept.id === this.doctor.departmentId);
    return department?.departmentName || '';
  });

  closeDoctorModal(): void {
    this.closeDoctorDetails.emit();
  }

  showAppointmentModal(): void {
    console.log('Appointment button clicked in Doctor Details');
    this.handleClick.emit(); // Emit the event to parent
  }
}