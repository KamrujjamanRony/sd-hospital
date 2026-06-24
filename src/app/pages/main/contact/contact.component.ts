import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environments';
import { HomeCover } from "../../../components/main/home/home-cover/home-cover";
import { AppStore } from '../../../store/app.store';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [HomeCover]
})
export class ContactComponent {
  private store = inject(AppStore);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);
  mapUrl: SafeResourceUrl;
  contact = this.store.address;

  constructor() {
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://maps.google.com/maps?q=${environment.location}&t=&z=13&ie=UTF8&iwloc=&output=embed`);
  }
}
