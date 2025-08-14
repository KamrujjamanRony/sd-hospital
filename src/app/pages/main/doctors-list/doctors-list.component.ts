import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DoctorsService } from '../../../services/serial/doctors.service';
import { MainDoctorsCardComponent } from '../../../components/main/shared/all-cards/doctors-card/doctors-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  imports: [CommonModule, MainDoctorsCardComponent]
})
export class MainDoctorListComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private doctorsService = inject(DoctorsService);
  private subscriptions: Subscription[] = [];

  department = signal<any>('');
  doctorList = signal<any[]>([]);
  emptyImg: string = '../../../../assets/images/doctor.png';
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.department.set(params['department']);
        this.loadDoctorsByDepartment();
      })
    );
  }

  loadDoctorsByDepartment(): void {
    this.loading.set(true);
    this.subscriptions.push(
      this.doctorsService.getDoctors().subscribe({
        next: (doctors) => {
          this.doctorList.set(doctors.filter(d => d.departmentId === this.department()));
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