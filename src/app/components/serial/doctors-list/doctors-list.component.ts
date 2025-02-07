import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from "../shared/page-header/page-header.component";
import { DoctorCardComponent } from '../doctor-card/doctor-card.component';
import { DoctorsService } from '../../../services/serial/doctors.service';

@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  imports: [CommonModule, PageHeaderComponent, DoctorCardComponent]
})
export class DoctorListComponent {
  department: any;
  doctorList: any[] = [];
  emptyImg: any = '../../../../assets/images/doctor.png';

  route = inject(ActivatedRoute);
  doctorService = inject(DoctorsService);


  constructor() { }

  ngOnInit(): void {
    this.route.params.subscribe(async params => {
      this.department = params['department'];
      this.doctorList = await this.doctorService.filterDoctorsByDepartment(this.department);
    });
  }
}
