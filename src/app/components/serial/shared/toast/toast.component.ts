import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'toast',
    imports: [],
    template: `
  <div class="toast">
  {{ message }}
  </div>
  `,
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './toast.component.css'
})
export class ToastComponent {
  @Input() message: string = '';
}
