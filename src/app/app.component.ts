import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import * as AOS from 'aos';
import { VisitorCountService } from './services/main/visitor-count.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, RouterOutlet, HttpClientModule],
})
export class AppComponent {
  title = 'The sd-hospital';
  visitorCount!: number;

  constructor(private visitorCountService: VisitorCountService) {}

  ngOnInit(): void {
    this.visitorCountService.incrementVisitorCount();
    this.visitorCount = this.visitorCountService.getVisitorCount();
    AOS.init({
      once: true,
      duration: 450,
      delay: 250,
      disable: 'mobile'
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      AOS.refresh()
    }, 500)
  }
}
