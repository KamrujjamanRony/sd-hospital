import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-cover',
    imports: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './cover.component.html'
})
export class CoverComponent {
  readonly title = input<any>('');
  readonly sub1 = input<any>('');
  readonly sub2 = input<any>('');

}
