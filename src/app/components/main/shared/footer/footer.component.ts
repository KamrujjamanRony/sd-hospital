import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { ContactService } from '../../../../services/main/contact.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-footer',
    imports: [FontAwesomeModule],
    templateUrl: './footer.component.html'
})
export class FooterComponent {
  contactService = inject(ContactService);
  router = inject(Router);
  faFacebook = faFacebook;
  faInstagram = faInstagram;
  faTwitter = faTwitter;
  allContact$?: Observable<any[]>;
  contact!: any;
  
  constructor() {}

  ngOnInit(): void {
    this.contactService.getCompanyAddress()
      .subscribe({
        next: (response) => {
          this.contact = response;
        }
      });
  }

  navigateToExternalLink(url: string | undefined): void {
    if (url) {
      window.open('http://' + url, '_blank');
    }
  }
}
