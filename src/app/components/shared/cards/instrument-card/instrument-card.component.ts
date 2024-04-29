import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-instrument-card',
  standalone: true,
  imports: [],
  templateUrl: './instrument-card.component.html',
  styleUrl: './instrument-card.component.css'
})
export class InstrumentCardComponent {
  @Input() img!: any;
  @Input() title!: any;
  @Input() origin!: any;

}
