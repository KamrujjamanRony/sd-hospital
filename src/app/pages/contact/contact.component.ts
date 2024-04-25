import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Carousel, Dropdown, initTE } from 'tw-elements';
import { environment } from '../../../environments/environments';
import { CoverComponent } from '../../components/shared/cover/cover.component';
import { ContactService } from '../../features/services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  standalone: true,
  imports: [CoverComponent]
})
export class ContactComponent implements OnInit {
  yourTitle: any = 'Contact Us';
  yourSub1: any = 'Home';
  yourSub2: any = 'Contact Us';
  allContact$?: Observable<any[]>;
  mapUrl: SafeResourceUrl;
  contact!: any;

  constructor(private contactService: ContactService, private router: Router, private sanitizer: DomSanitizer) {
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
