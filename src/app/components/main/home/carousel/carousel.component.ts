import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import { CarouselService } from '../../../../features/services/carousel.service';
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
  slideImages: any[] = [];
  loading: boolean = true;

  constructor(private carouselService: CarouselService) {
    carouselService.getCompanyCarousel().subscribe(data => {
      this.slideImages = data
    });
  }

}
