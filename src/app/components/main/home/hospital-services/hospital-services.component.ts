import { Component, inject } from '@angular/core';
import { ServicesService } from '../../../../services/main/services.service';

@Component({
    selector: 'app-hospital-services',
    imports: [],
    templateUrl: './hospital-services.component.html',
    styleUrl: './hospital-services.component.css'
})
export class HospitalServicesComponent {
  servicesService = inject(ServicesService);
  services: any;
  header: any;

  constructor() {}

  ngOnInit(): void {
    this.servicesService.getCompanyServices().subscribe(data => {
      this.header = data[0]?.title;
      this.services = data.slice(1, data.length);
    });
  }
}
