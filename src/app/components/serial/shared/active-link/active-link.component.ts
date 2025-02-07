import { CommonModule } from '@angular/common';
import { Component, Input, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-active-link',
    imports: [RouterLink, CommonModule],
    template: `
    <a [routerLink]="to()" [ngClass]="{'border-b-2': isActive}">
      {{ children() }}
    </a>
  `
})
export class ActiveLinkComponent {
  readonly to = input.required<string>();
  readonly children = input.required<string>();
  @Input() isDropdownOpen!: boolean;
  router = inject(Router);

  constructor() {}

  get isActive(): boolean {
    if (this.router.url.includes(this.to()) ) {
      return true;
    } else {
      return false;
    }
  }
  handleDropdownOpen(){
    this.isDropdownOpen =false;
  }
}

