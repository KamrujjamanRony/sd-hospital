import { Component, inject, signal } from '@angular/core';
import { AppStore } from '../../../../store/app.store';

@Component({
  selector: 'app-hospital-services',
  imports: [],
  templateUrl: './hospital-services.component.html',
  styleUrl: './hospital-services.component.css'
})
export class HospitalServicesComponent {
  private store = inject(AppStore);
  services = this.store.services()?.slice(1, this.store.services.length);
  header = this.store.services()[0]?.title;
}
