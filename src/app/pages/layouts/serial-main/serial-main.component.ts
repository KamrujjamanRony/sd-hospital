import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../components/serial/shared/navbar/navbar.component';

@Component({
  selector: 'app-serial-main',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './serial-main.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./serial-main.component.css']
})
export class SerialMainComponent {
}