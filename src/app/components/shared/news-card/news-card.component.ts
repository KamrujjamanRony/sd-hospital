import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NewsModalComponent } from "../news-modal/news-modal.component";

@Component({
    selector: 'app-news-card',
    standalone: true,
    templateUrl: './news-card.component.html',
    styleUrl: './news-card.component.css',
    imports: [CommonModule, NewsModalComponent]
})
export class NewsCardComponent {
  @Input() img!: any;
  @Input() title!: any;
  @Input() subtitle!: any;
  @Input() description!: any;
  @Input() isAside: boolean = false;
  showModal: boolean = false;

  openNewsDetails() {
    this.showModal = true;
  }

  closeNewsDetails() {
    this.showModal = false;
  }

}
