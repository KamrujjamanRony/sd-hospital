
import { Component, inject } from '@angular/core';
import { InstrumentCardComponent } from "../../../../components/main/shared/all-cards/instrument-card/instrument-card.component";
import { HomeCover } from "../../../../components/main/home/home-cover/home-cover";
import { AppStore } from '../../../../store/app.store';

@Component({
  selector: 'app-instrument-gallery',
  templateUrl: './instrument-gallery.component.html',
  imports: [InstrumentCardComponent, HomeCover]
})
export class InstrumentGalleryComponent {
  private store = inject(AppStore);
  instruments = this.store.instruments;
}
