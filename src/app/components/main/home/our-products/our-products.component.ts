import { Component, Renderer2, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InstrumentCardComponent } from '../../shared/all-cards/instrument-card/instrument-card.component';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../../../store/app.store';

@Component({
  selector: 'app-our-products',
  imports: [RouterLink, InstrumentCardComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './our-products.component.html'
})
export class OurProductsComponent {
  private store = inject(AppStore);
  router = inject(Router);
  renderer = inject(Renderer2);
  instruments = this.store.instruments;

  scrollToTop() {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }

}
