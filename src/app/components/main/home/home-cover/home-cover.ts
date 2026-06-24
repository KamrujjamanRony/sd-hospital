import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-home-cover',
  imports: [],
  templateUrl: './home-cover.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home-cover.css'
})
export class HomeCover {
  @Input() title: string = "";
  @Input() path: string = "";

}
