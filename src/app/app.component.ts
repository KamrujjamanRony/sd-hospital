import { Component, inject } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { VisitorCountService } from './services/main/visitor-count.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet]
})
export class AppComponent {
  visitorCountService = inject(VisitorCountService);

  title = 'sd-hospital';
  visitorCount!: number;

  constructor() { }

  ngOnInit(): void {
    this.visitorCountService.incrementVisitorCount();
    this.visitorCount = this.visitorCountService.getVisitorCount();
  }
}
