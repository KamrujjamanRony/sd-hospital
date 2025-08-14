import { Component, OnInit, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { AboutService } from '../../../services/main/about.service';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  imports: []
})
export class AboutComponent implements OnInit {
  aboutService = inject(AboutService);
  about = signal<any>(null);

  ngOnInit(): void {
    this.aboutService.getAllAbout().subscribe(aboutUs => {
      if (aboutUs) {
        this.about.set(aboutUs.find(a => a.companyID === environment.hospitalCode));
      }
    });
  };
}
