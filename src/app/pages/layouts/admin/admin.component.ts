import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../../../components/serial/shared/all-sidebar/mis-sidebar/sidebar.component";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.css',
    imports: [FormsModule, RouterOutlet, SidebarComponent]
})
export class AdminComponent {

}
