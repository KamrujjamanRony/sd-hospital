import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageHeaderComponent } from "../shared/page-header/page-header.component";
import { DoctorCardComponent } from '../doctor-card/doctor-card.component';
import { DoctorsService } from '../../../services/serial/doctors.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  templateUrl: './doctors-list.component.html',
  imports: [PageHeaderComponent, DoctorCardComponent]
})
export class DoctorListComponent implements OnInit {
  department = '';
  doctorList = signal<any[]>([]);
  emptyImg: any = '../../../../assets/images/doctor.png';
  private subscriptions: Subscription[] = [];
  loading = signal<boolean>(true);

  route = inject(ActivatedRoute);
  doctorsService = inject(DoctorsService);

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.department = params['department'];
        this.loadDoctorsByDepartment();
      })
    );
  }

  loadDoctorsByDepartment(): void {
    this.loading.set(true);
    this.subscriptions.push(
      this.doctorsService.getDoctors().subscribe({
        next: (doctors) => {
          this.doctorList.set(doctors.filter(d => d.departmentId === this.department));
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading doctors:', error);
          this.loading.set(false);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}