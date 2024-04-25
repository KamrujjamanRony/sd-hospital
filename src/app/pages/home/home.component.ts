import { Component } from '@angular/core';
import { CarouselComponent } from "../../components/main/home/carousel/carousel.component";
import { HeroComponent } from "../../components/main/home/hero/hero.component";
import { OurDoctorsComponent } from "../../components/main/home/our-doctors/our-doctors.component";
import { OurProductsComponent } from "../../components/main/home/our-products/our-products.component";
import { HospitalServicesComponent } from '../../components/main/home/hospital-services/hospital-services.component';
import { OurHospitalGalleryComponent } from "../../components/main/home/our-hospital-gallery/our-hospital-gallery.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [CarouselComponent, HeroComponent, OurDoctorsComponent, OurProductsComponent, HospitalServicesComponent, OurHospitalGalleryComponent]
})
export class HomeComponent {

}
