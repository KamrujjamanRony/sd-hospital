import { Component } from '@angular/core';
import { HospitalServicesComponent } from "../../../components/main/home/hospital-services/hospital-services.component";

@Component({
    selector: 'app-our-services',
    standalone: true,
    templateUrl: './our-services.component.html',
    styleUrl: './our-services.component.css',
    imports: [HospitalServicesComponent]
})
export class OurServicesComponent {

}
