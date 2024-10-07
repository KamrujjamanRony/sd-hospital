import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-category',
    standalone: true,
    templateUrl: './category.component.html',
    imports: [RouterLink]
})
export class CategoryComponent {
  @Input() category: any;

  constructor() { }

}
