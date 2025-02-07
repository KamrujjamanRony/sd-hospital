import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    imports: [RouterLink]
})
export class CategoryComponent {
  readonly category = input<any>();

  constructor() { }

}
