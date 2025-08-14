import { Component, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CoverComponent } from '../../../components/serial/shared/cover/cover.component';
import { DoctorsService } from '../../../services/serial/doctors.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css',
  imports: [CoverComponent]
})
export class SerialDoctorComponent {
  doctorsService = inject(DoctorsService);
  route = inject(ActivatedRoute);

  emptyImg: any = '../../../../assets/images/doctor.png';
  id = signal<any>(null);
  doctor = signal<any>(null);
  paramsSubscription?: Subscription;

  constructor() { };

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe(params => {
      this.id.set(params.get('id'));
      if (this.id()) {
        this.doctorsService.getDoctorById(this.id()).subscribe({
          next: (data: any | undefined) => {
            this.doctor.set(data);
          }
        });
      }
    })
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
  }

}
