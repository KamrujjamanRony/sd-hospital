import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

@Component({
    selector: 'app-footer',
    imports: [FontAwesomeModule],
    templateUrl: './footer.component.html'
})
export class FooterComponent {
  faFacebook = faFacebook;
  faInstagram = faInstagram;
  faTwitter = faTwitter;

}
