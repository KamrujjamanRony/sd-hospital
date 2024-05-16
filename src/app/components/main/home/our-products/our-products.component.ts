import { Component, Renderer2, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InstrumentCardComponent } from '../../shared/all-cards/instrument-card/instrument-card.component';
import { InstrumentService } from '../../../../services/main/instrument.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-our-products',
  standalone: true,
  imports: [RouterLink, InstrumentCardComponent],
  templateUrl: './our-products.component.html'
})
export class OurProductsComponent {
  instrumentService = inject(InstrumentService);
  router = inject(Router);
  renderer = inject(Renderer2);
  instruments$?: Observable<any[]>;
  instruments?: any;
  constructor() { }

  ngOnInit(): void {
    this.instruments$ = this.instrumentService.getCompanyInstrument();
    this.instruments$.subscribe(data => {
      this.instruments = data.slice(0, 3);
    })
  }

  scrollToTop() {
    // Scroll to the top of the page
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }

}
