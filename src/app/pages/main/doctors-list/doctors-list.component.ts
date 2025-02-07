import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorsService } from '../../../services/serial/doctors.service';
import { MainDoctorsCardComponent } from '../../../components/main/shared/all-cards/doctors-card/doctors-card.component';

@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  imports: [CommonModule, MainDoctorsCardComponent]
})
export class MainDoctorListComponent {
  route = inject(ActivatedRoute);
  doctorService = inject(DoctorsService);

  department: any;
  doctorList: any[] = [];
  emptyImg: any = '../../../../assets/images/doctor.png';

  constructor() { }

  ngOnInit(): void {
    this.route.params.subscribe(async params => {
      this.department = params['department'];
      this.doctorList = await this.doctorService.filterDoctorsByDepartment(this.department);
    });
  }
}
