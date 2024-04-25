import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CoverComponent } from "../../../components/shared/cover/cover.component";
import { InstrumentCardComponent } from "../../../components/shared/instrument-card/instrument-card.component";
import { Observable } from 'rxjs';
import { InstrumentService } from '../../../features/services/instrument.service';

@Component({
    selector: 'app-instrument-gallery',
    standalone: true,
    templateUrl: './instrument-gallery.component.html',
    imports: [CommonModule, CoverComponent, InstrumentCardComponent]
})
export class InstrumentGalleryComponent {
  
  instruments$?: Observable<any[]>;
  instruments?: any;

  constructor(private instrumentService: InstrumentService) { 
    if (!this.instruments$) {
      this.instruments$ = instrumentService.getCompanyInstrument();
      this.instruments$.subscribe(data => {
        this.instruments = data;
      })
    }
  }

}
