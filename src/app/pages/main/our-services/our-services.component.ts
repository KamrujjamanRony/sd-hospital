import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HospitalServicesComponent } from "../../../components/main/home/hospital-services/hospital-services.component";
import { HomeCover } from "../../../components/main/home/home-cover/home-cover";

@Component({
    selector: 'app-our-services',
    standalone: true,
    templateUrl: './our-services.component.html',
    styleUrl: './our-services.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [HospitalServicesComponent, HomeCover]
})
export class OurServicesComponent {

}
