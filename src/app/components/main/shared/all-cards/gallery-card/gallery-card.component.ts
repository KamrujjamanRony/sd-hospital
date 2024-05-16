import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gallery-card',
  standalone: true,
  imports: [],
  templateUrl: './gallery-card.component.html',
  styleUrl: './gallery-card.component.css'
})
export class GalleryCardComponent {
  @Input() img!: any;
  @Input() title!: any;
  @Input() description!: any;

}
