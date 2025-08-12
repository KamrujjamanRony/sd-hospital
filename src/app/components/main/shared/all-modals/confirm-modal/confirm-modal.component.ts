import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  readonly title = input.required<any>();
  readonly url = input.required<any>();
  readonly closeModal = output<void>();
  router = inject(Router);

  closeThisModal(): void {
    this.closeModal.emit();
    this.router.navigate([this.url()]);
  }
}
