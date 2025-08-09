import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselService } from '../../../../services/main/carousel.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {
  slides: any[] = [];
  currentIndex = 0;
  loading = true;
  private intervalId: any;

  constructor(private carouselService: CarouselService) { }

  ngOnInit(): void {
    this.carouselService.getCompanyCarousel().subscribe({
      next: (data) => {
        this.slides = data.filter(slide => slide.imageUrl);
        this.loading = false;
        this.startAutoPlay();
      },
      error: (error) => {
        console.error('Error loading carousel:', error);
        this.loading = false;
      }
    });
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
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.resetAutoPlay();
  }

  resetAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}