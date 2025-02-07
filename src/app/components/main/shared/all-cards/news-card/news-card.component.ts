import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { NewsModalComponent } from "../../all-modals/news-modal/news-modal.component";

@Component({
    selector: 'app-news-card',
    templateUrl: './news-card.component.html',
    styleUrl: './news-card.component.css',
    imports: [CommonModule, NewsModalComponent]
})
export class NewsCardComponent {
  @Input() img!: any;
  readonly title = input.required<any>();
  readonly subtitle = input.required<any>();
  readonly description = input.required<any>();
  readonly isAside = input<boolean>(false);
  showModal: boolean = false;

  openNewsDetails() {
    this.showModal = true;
  }

  closeNewsDetails() {
    this.showModal = false;
  }

}
