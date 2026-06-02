import { Component, input, output } from '@angular/core';

@Component({
    selector: 'confirm-modal',
    imports: [],
    templateUrl: './confirm-modal.component.html',
    styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  readonly title = input.required<any>();
  readonly closeModal = output<void>();

  constructor(){}

  closeThisModal(): void {
    this.closeModal.emit();
  }
}
