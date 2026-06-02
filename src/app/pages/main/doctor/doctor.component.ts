import { Component, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HomeCover } from "../../../components/main/home/home-cover/home-cover";
import { AppStore } from '../../../store/app.store';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css',
  imports: [HomeCover]
})
export class DoctorComponent {
  private store = inject(AppStore);
  route = inject(ActivatedRoute);

  emptyImg: any = './assets/images/doctor.png';
  id = signal<any>(null);
  paramsSubscription?: Subscription;
  doctor = signal<any>(null);

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe(params => {
      this.id.set(params.get('id'));
      if (this.id()) {
        this.doctor.set(this.store.getDoctorById(this.id()));
      }
    })
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
  }

}
