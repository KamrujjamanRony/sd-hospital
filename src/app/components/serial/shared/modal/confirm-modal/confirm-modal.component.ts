import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'confirm-modal',
    imports: [],
    templateUrl: './confirm-modal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
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
