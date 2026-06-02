import { Component, inject, input } from '@angular/core';
import { AppStore } from '../../../../../store/app.store';

@Component({
  selector: 'confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  store = inject(AppStore);
  readonly title = input.required<any>();
  // location = inject(Location);

  closeThisModal(): void {
    this.store.setSuccess(null);
    // this.location.back();
  }
}
