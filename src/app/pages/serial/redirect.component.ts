import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-redirect',
    template: '',
    styleUrls: [],
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
