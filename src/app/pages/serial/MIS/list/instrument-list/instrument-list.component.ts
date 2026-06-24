import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { environment } from '../../../../../../environments/environments';
import { AppStore } from '../../../../../store/app.store';

@Component({
  selector: 'app-instrument-list',
  imports: [CoverComponent, RouterLink],
  templateUrl: './instrument-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './instrument-list.component.css'
})
export class InstrumentListComponent {
  store = inject(AppStore);
  emptyImg: any = environment.emptyImg;
  instruments = this.store.instruments;

  onDelete(id: any): void {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.store.deleteInstrument(id);
    }
  }

}
