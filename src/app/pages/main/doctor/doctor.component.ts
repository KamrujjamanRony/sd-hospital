import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { DoctorsServiceMain } from '../../../services/main/doctors.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css',
  imports: []
})
export class DoctorComponent {
  doctorsService = inject(DoctorsServiceMain);
  route = inject(ActivatedRoute);

  emptyImg: any = '../../../../assets/images/doctor.png';
  id: any | null = null;
  paramsSubscription?: Subscription;
  doctor?: any;

  constructor() { };

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.doctorsService.getDoctor(this.id).subscribe({
          next: (data: any | undefined) => {
            this.doctor = data;
          }
        });
      }
    })
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
  }

}
