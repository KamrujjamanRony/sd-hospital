import { Component, Input, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environments';
@Component({
    selector: 'app-delete-confirmation-modal',
    template: `
    <div class="modal-container bg-orange-50">
      <h1 class="font-bold">Are you sure you want to delete this item?</h1>
      <div class="form-control w-full max-w-xs">
        <label class="label">
          <span class="label-text">Enter your password:</span>
        </label>
        <input type="password" placeholder="Auth Code" [(ngModel)]="password" class="input input-bordered input-accent w-full max-w-xs" />
        <label class="label">
          <span class="label-text-alt text-red-500">{{err}}</span>
        </label>
      </div>
      <div class="flex justify-center mt-5">
        <button mat-button (click)="confirm()" class="btn btn-outline btn-error mr-1">Confirm</button>
        <button mat-button (click)="cancel()" class="btn bg-blue-600 hover:bg-blue-500 px-3 rounded btn-square btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  `,
    styles: [`
    .modal-container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      text-align: center;
    }
    .modal {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    text-align: center;
    border: 1px solid red; /* Add a border for testing */
    z-index: 100000000;
  }

    h2, p {
      text-align: center;
    }
  `],
    imports: [FormsModule]
})
export class DeleteConfirmationModalComponent {
  confirmDelete = output<void>();
  closeModal = output<void>();
  err: any = '';
  password: any = '';

  constructor() { }

  confirm(): void {
    this.password === environment.authKey ? this.confirmDelete.emit() : this.err = "Please enter correct password";
  }

  cancel(): void {
    this.closeModal.emit();
  }
}
