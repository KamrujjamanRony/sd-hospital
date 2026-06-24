import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { AppStore } from '../../../../store/app.store';

@Component({
  selector: 'app-footer',
  imports: [FontAwesomeModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  private store = inject(AppStore);
  faFacebook = faFacebook;
  faInstagram = faInstagram;
  faTwitter = faTwitter;
  contact = this.store.address;
}
