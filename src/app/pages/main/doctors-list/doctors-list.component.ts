import { Component, inject, OnInit, OnDestroy } from '@angular/core';
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

  department: string = '';
  doctorList: any[] = [];
  doctors$!: Observable<any[]>;
  emptyImg: string = '../../../../assets/images/doctor.png';
  loading: boolean = true;

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.department = params['department'];
        this.loadDoctorsByDepartment();
      })
    );
  }

  loadDoctorsByDepartment(): void {
    this.loading = true;
    this.subscriptions.push(
      this.doctorsService.getDoctors().subscribe({
        next: (doctors) => {
          this.doctorList = doctors.filter(d => d.departmentId === this.department);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading doctors:', error);
          this.loading = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}