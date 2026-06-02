import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainDoctorsCardComponent } from '../../../components/main/shared/all-cards/doctors-card/doctors-card.component';

import { HomeCover } from "../../../components/main/home/home-cover/home-cover";
import { AppStore } from '../../../store/app.store';

@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  imports: [MainDoctorsCardComponent, HomeCover]
})
export class MainDoctorListComponent implements OnInit, OnDestroy {
  store = inject(AppStore)
  private route = inject(ActivatedRoute);
  private subscriptions: Subscription[] = [];

  department = signal<any>('');
  doctorList = signal<any[]>([]);
  emptyImg: string = './assets/images/doctor.png';

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.department.set(params['department']);
        this.loadDoctorsByDepartment();
      })
    );
  }

  loadDoctorsByDepartment(): void {
    this.doctorList.set(this.store.doctors().filter(d => d.departmentId === this.department()));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}