import { Component, Renderer2, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CoverComponent } from '../../../components/serial/shared/cover/cover.component';
import { environment } from '../../../../environments/environments';
import { DoctorsService } from '../../../services/serial/doctors.service';

@Component({
    selector: 'app-doctors',
    standalone: true,
    templateUrl: './doctors.component.html',
    styleUrl: './doctors.component.css',
    imports: [CommonModule, RouterLink, CoverComponent]
})
export class DoctorsComponent {
  doctorsService = inject(DoctorsService);
  renderer = inject(Renderer2);
  emptyImg: any = '../../../../assets/images/doctor.png';
  
  hospitalDoctors$?: Observable<any[]>;
  hospitalCode: any = environment.hospitalCode;

  constructor() {}

  ngOnInit(): void {
    // this.hospitalDoctors$ = this.doctorsService.getAllDoctors().pipe(
    //   map((doctors: any[]) =>
    //     doctors.filter((doctor: any) => doctor.hospitalCode == this.hospitalCode)
    //   )
    // );
  }

  scrollToTop() {
    // Scroll to the top of the page
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }

}
