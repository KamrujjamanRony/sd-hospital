import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  @Input() title!: any;
  @Input() url!: any;
  @Output() closeModal = new EventEmitter<void>();

  constructor(private router: Router) { }

  closeThisModal(): void {
    this.closeModal.emit();
    this.router.navigate([this.url]);
  }
}
