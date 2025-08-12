import { Component, Renderer2, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InstrumentCardComponent } from '../../shared/all-cards/instrument-card/instrument-card.component';
import { InstrumentService } from '../../../../services/main/instrument.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-our-products',
  imports: [RouterLink, InstrumentCardComponent, CommonModule],
  templateUrl: './our-products.component.html'
})
export class OurProductsComponent {
  instrumentService = inject(InstrumentService);
  router = inject(Router);
  renderer = inject(Renderer2);
  instruments = signal<any[]>([]);

  ngOnInit(): void {
    this.instrumentService.getCompanyInstrument().subscribe(data => {
      this.instruments.set(data);
    });
  }

  scrollToTop() {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }

}
