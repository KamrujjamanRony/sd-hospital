import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import { CarouselService } from '../../../../services/main/carousel.service';
// register Swiper custom elements
register();

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './carousel.component.html'
})
export class CarouselComponent {
  carouselService = inject(CarouselService);
[x: string]: any;
  slideImages: any[] = [];
  loading: boolean = true;

  constructor() {}

  ngOnInit(): void {
    this.carouselService.getCompanyCarousel().subscribe(data => {
      this.slideImages = data
    });
  }

}
