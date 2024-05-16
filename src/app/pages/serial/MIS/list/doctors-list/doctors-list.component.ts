import { Component, inject } from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { DoctorsService } from '../../../../../services/main/doctors.service';
import { AuthService } from '../../../../../services/serial/auth.service';

@Component({
    selector: 'app-doctors-list',
    standalone: true,
    templateUrl: './doctors-list.component.html',
    imports: [CoverComponent, CommonModule, RouterLink]
})
export class DoctorsListComponent {
  authService = inject(AuthService);
  doctorsService = inject(DoctorsService);
  router = inject(Router);
  user: any;

  doctorMale: any = '../../../../../assets/images/doctor.png';

  doctors$?: Observable<any[]>;
  deleteDoctorSubscription?: Subscription;

  hospitalCode: any = 10;  // Select the code for different hospital codes

  constructor() { }

  onDelete(id: any): void {
    console.log(id);
    this.deleteDoctorSubscription = this.doctorsService.deleteDoctor(id).subscribe({
      next: () => {
        this.doctors$ = this.doctorsService.getCompanyDoctor();
      }
    })
  }


  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.doctors$ = this.doctorsService.getCompanyDoctor().pipe(
      map(doctors => doctors.sort((a, b) => a.drSerial - b.drSerial))
    );
  }

  checkRoles(roleId: any) {
    const result = this.user?.roleIds?.find((role: any) => role == roleId)
    return result;
  }

  ngOnDestroy(): void {
    this.deleteDoctorSubscription?.unsubscribe();
  }

}
