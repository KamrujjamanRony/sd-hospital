import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Carousel, Dropdown, initTE } from 'tw-elements';
import { environment } from '../../../../environments/environments';
import { ContactService } from '../../../services/main/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  imports: []
})
export class ContactComponent implements OnInit {
  contactService = inject(ContactService);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);

  allContact$?: Observable<any[]>;
  mapUrl: SafeResourceUrl;
  contact!: any;

  constructor() {
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://maps.google.com/maps?q=${environment.location}&t=&z=13&ie=UTF8&iwloc=&output=embed`);
  }

  ngOnInit(): void {
    initTE({ Carousel, Dropdown });
    this.allContact$ = this.contactService.getCompanyAddress();
    this.allContact$.subscribe(contactUs => {
      if (contactUs) {
        this.contact = contactUs;
      }
    });
  }
}
