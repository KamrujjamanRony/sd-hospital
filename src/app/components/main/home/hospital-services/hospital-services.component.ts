import { Component } from '@angular/core';
import { ServicesService } from '../../../../features/services/main/services.service';

@Component({
  selector: 'app-hospital-services',
  standalone: true,
  imports: [],
  templateUrl: './hospital-services.component.html',
  styleUrl: './hospital-services.component.css'
})
export class HospitalServicesComponent {
  services: any;
  header: any;

  constructor(private ServicesService: ServicesService) {
    if (!this.services) {
      ServicesService.getCompanyServices().subscribe(data => {
        this.header = data[0]?.title;
        this.services = data.slice(1, data.length);
      });
    }
  }
}
