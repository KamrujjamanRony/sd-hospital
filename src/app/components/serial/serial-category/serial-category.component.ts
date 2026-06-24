import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-serial-category',
  templateUrl: './serial-category.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink]
})
export class SerialCategoryComponent {
  readonly category = input<any>();

  constructor() { }

}
