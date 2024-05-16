import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

@Component({
  selector: 'news-modal',
  standalone: true,
  imports: [],
  templateUrl: './news-modal.component.html',
  styleUrl: './news-modal.component.css'
})
export class NewsModalComponent {
  @Input() img!: any;
  @Input() title!: any;
  @Input() subtitle!: any;
  @Input() description!: any;
  @Output() closeNewsDetails = new EventEmitter<void>();
  // departmentService = inject(DepartmentService);

  closeNewsModal(): void {
    this.closeNewsDetails.emit();
  }

}
