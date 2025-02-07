import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CoverComponent } from "../../../components/main/shared/cover/cover.component";
import { DoctorCardComponent } from "../../../components/main/shared/all-cards/doctor-card/doctor-card.component";
import { DoctorsServiceMain } from '../../../services/main/doctors.service';

@Component({
  selector: 'app-doctors',
  standalone: true,
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css',
  imports: [CommonModule, CoverComponent, DoctorCardComponent]
})
export class DoctorsComponent {
  doctorsService = inject(DoctorsServiceMain);

  emptyImg: any = '../../../../assets/images/doctor.png';

  doctors$?: Observable<any[]>;

  constructor() { }

  ngOnInit(): void {
    this.doctors$ = this.doctorsService.getAllDoctor();
  }

}
