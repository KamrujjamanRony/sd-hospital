import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../components/serial/shared/navbar/navbar.component';

@Component({
  selector: 'app-serial-main',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './serial-main.component.html',
  styleUrls: ['./serial-main.component.css']
})
export class SerialMainComponent {
}