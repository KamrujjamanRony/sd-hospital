import { Component, ChangeDetectionStrategy } from '@angular/core';

import { PageHeaderComponent } from '../../../components/serial/shared/page-header/page-header.component';
import { NavbarComponent } from '../../../components/serial/shared/navbar/navbar.component';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [PageHeaderComponent, NavbarComponent]
})
export class HomeComponent {
}
