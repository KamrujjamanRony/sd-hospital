import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy } from '@angular/core';

import { AppStore } from '../../../../store/app.store';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [],
  templateUrl: './carousel.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {
  private store = inject(AppStore);

  // Select signals from the store
  slides = this.store.carousels;
  loading = this.store.loading;

  currentIndex = 0;
  private intervalId: any;

  ngOnInit(): void {
    // Load carousels if not already loaded
    if (this.slides().length === 0) {
      this.store.loadCarousels();
    }
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  startAutoPlay(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  stopAutoPlay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide(): void {
    if (this.slides().length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.slides().length;
    }
  }

  prevSlide(): void {
    if (this.slides().length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.slides().length) % this.slides().length;
    }
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.resetAutoPlay();
  }

  resetAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  // Helper getter for template
  get filteredSlides() {
    return this.slides().filter(slide => slide.imageUrl);
  }
}