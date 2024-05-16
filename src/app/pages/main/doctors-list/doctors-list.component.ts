import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorsService } from '../../../services/serial/doctors.service';
import { CoverComponent } from '../../../components/serial/shared/cover/cover.component';
import { PageHeaderComponent } from '../../../components/serial/shared/page-header/page-header.component';
import { MainDoctorsCardComponent } from '../../../components/main/shared/all-cards/doctors-card/doctors-card.component';

@Component({
    selector: 'app-doctors-list',
    standalone: true,
    templateUrl: './doctors-list.component.html',
    imports: [CoverComponent, CommonModule, RouterLink, PageHeaderComponent, MainDoctorsCardComponent]
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
