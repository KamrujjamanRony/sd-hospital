import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-instrument-card',
    imports: [],
    templateUrl: './instrument-card.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './instrument-card.component.css'
})
export class InstrumentCardComponent {
  readonly img = input.required<any>();
  readonly title = input.required<any>();
  readonly origin = input.required<any>();

}
