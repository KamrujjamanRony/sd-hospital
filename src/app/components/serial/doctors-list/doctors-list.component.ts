import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorCardComponent } from '../doctor-card/doctor-card.component';
import { AppStore } from '../../../store/app.store';
import { PageHeaderComponent } from "../shared/page-header/page-header.component";

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  templateUrl: './doctors-list.component.html',
  imports: [DoctorCardComponent, PageHeaderComponent]
})
export class DoctorListComponent implements OnInit {
  route = inject(ActivatedRoute);
  store = inject(AppStore);

  department = signal<string>('');
  emptyImg = './images/doctor.png';
  loading = signal<boolean>(true);

  // Computed signal for filtered doctors by department
  filteredDoctors = computed(() => {
    const dept = this.department();
    const doctors = this.store.doctors();

    if (dept) {
      return doctors.filter(doctor => doctor.departmentId === dept);
    }

    return doctors;
  });

  // Computed signal for department name
  departmentName = computed(() => {
    const deptId = this.department();
    const departments = this.store.departments();
    return departments.find(dept => dept.id === deptId)?.departmentName || '';
  });

  ngOnInit(): void {
    // Subscribe to route parameters
    this.route.params.subscribe(params => {
      this.department.set(params['department']);
      this.loading.set(false); // Data is already in store, no loading needed
    });
  }
}