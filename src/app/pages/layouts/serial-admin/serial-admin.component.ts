
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../../components/serial/shared/all-sidebar/serial-sidebar/sidebar.component';

@Component({
    selector: 'app-serial-admin',
    imports: [FormsModule, RouterOutlet, SidebarComponent],
    templateUrl: './serial-admin.component.html',
    styleUrl: './serial-admin.component.css'
})
export class SerialAdminComponent {

}
