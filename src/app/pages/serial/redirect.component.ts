import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-redirect',
    template: '',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class RedirectComponent implements OnInit {
  router = inject(Router);

  constructor() { }

  ngOnInit(): void {
    this.redirectToAllAppointment();
  }

  redirectToAllAppointment(): void {
    this.router.navigateByUrl('/all-appointment');
  }
}
