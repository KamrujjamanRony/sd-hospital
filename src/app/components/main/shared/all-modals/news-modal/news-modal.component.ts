import { Component, Input, inject, input, output } from '@angular/core';

@Component({
    selector: 'news-modal',
    imports: [],
    templateUrl: './news-modal.component.html',
    styleUrl: './news-modal.component.css'
})
export class NewsModalComponent {
  @Input() img!: any;
  readonly title = input.required<any>();
  readonly subtitle = input.required<any>();
  readonly description = input.required<any>();
  readonly closeNewsDetails = output<void>();

  closeNewsModal(): void {
    this.closeNewsDetails.emit();
  }

}
