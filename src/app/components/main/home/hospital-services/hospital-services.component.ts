import { Component, inject, signal } from '@angular/core';
import { ServicesService } from '../../../../services/main/services.service';

@Component({
  selector: 'app-hospital-services',
  imports: [],
  templateUrl: './hospital-services.component.html',
  styleUrl: './hospital-services.component.css'
})
export class HospitalServicesComponent {
  servicesService = inject(ServicesService);
  services = signal<any>([]);
  header = signal<any>('');

  constructor() { }

  ngOnInit(): void {
    this.servicesService.getCompanyServices().subscribe(data => {
      this.header.set(data[0]?.title);
      this.services.set(data?.slice(1, data.length));
    });
  }
}
