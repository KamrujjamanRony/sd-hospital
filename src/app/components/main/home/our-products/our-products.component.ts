import { Component, Renderer2 } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InstrumentCardComponent } from '../../../shared/instrument-card/instrument-card.component';
import { InstrumentService } from '../../../../features/services/instrument.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-our-products',
  standalone: true,
  imports: [RouterLink, InstrumentCardComponent],
  templateUrl: './our-products.component.html'
})
export class OurProductsComponent {
  instruments$?: Observable<any[]>;
  instruments?: any;
  constructor(private instrumentService: InstrumentService, private router: Router, private renderer: Renderer2) {
    if (!this.instruments$) {
      this.instruments$ = instrumentService.getCompanyInstrument();
      this.instruments$.subscribe(data => {
        this.instruments = data.slice(0,3);
      })
    }
  }

  scrollToTop() {
    // Scroll to the top of the page
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }

}
