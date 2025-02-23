import { Component, input } from '@angular/core';

@Component({
    selector: 'app-instrument-card',
    imports: [],
    templateUrl: './instrument-card.component.html',
    styleUrl: './instrument-card.component.css'
})
export class InstrumentCardComponent {
  readonly img = input.required<any>();
  readonly title = input.required<any>();
  readonly origin = input.required<any>();

}
