import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AppStore } from './store/app.store';
import { ConfirmModalComponent } from "./components/main/shared/all-modals/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmModalComponent],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css'
})
export class App {
  protected title = 'sd-hospital';

  store = inject(AppStore);

  ngOnInit() {
    initFlowbite();
    // Load ALL data once when app starts
    this.store.initializeApp();
  }

  retryLoading() {
    this.store.clearError();
    this.store.initializeApp();
  }

  closeError() {
    this.store.clearError();
  }
}
