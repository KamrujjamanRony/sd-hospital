
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../../../components/main/shared/navbar/navbar.component";
import { FooterComponent } from "../../../components/main/shared/footer/footer.component";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrl: './main.component.css',
    imports: [RouterOutlet, FormsModule, NavbarComponent, FooterComponent]
})
export class MainComponent {
}
