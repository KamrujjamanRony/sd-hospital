import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink]
})
export class CategoryComponent {
  readonly category = input<any>();

  constructor() { }

}
