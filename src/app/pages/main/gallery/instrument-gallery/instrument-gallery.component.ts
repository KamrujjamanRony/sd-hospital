
import { Component, inject } from '@angular/core';
import { InstrumentCardComponent } from "../../../../components/main/shared/all-cards/instrument-card/instrument-card.component";
import { Observable } from 'rxjs';
import { InstrumentService } from '../../../../services/main/instrument.service';

@Component({
  selector: 'app-instrument-gallery',
  templateUrl: './instrument-gallery.component.html',
  imports: [InstrumentCardComponent]
})
export class InstrumentGalleryComponent {
  instrumentService = inject(InstrumentService);

  instruments$?: Observable<any[]>;
  instruments?: any;

  constructor() { }

  ngOnInit(): void {
    this.instruments$ = this.instrumentService.getCompanyInstrument();
    this.instruments$.subscribe(data => {
      this.instruments = data;
    })
  }

}
