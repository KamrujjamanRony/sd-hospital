import { Component, input } from '@angular/core';

@Component({
    selector: 'app-gallery-card',
    imports: [],
    templateUrl: './gallery-card.component.html',
    styleUrl: './gallery-card.component.css'
})
export class GalleryCardComponent {
  readonly img = input.required<any>();
  readonly title = input.required<any>();
  readonly description = input.required<any>();

}
