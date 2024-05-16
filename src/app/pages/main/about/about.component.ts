import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CoverComponent } from '../../../components/main/shared/cover/cover.component';
import { AboutService } from '../../../services/main/about.service';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  standalone: true,
  imports: [CoverComponent]
})
export class AboutComponent implements OnInit {
  aboutService = inject(AboutService);
  
  allAbout$?: Observable<any[]>;
  about!: any;

  constructor() { }
  
  ngOnInit(): void {
    this.allAbout$ = this.aboutService.getAllAbout();
      this.allAbout$.subscribe(aboutUs => {
        if (aboutUs) {
          this.about = aboutUs.find(a=>a.companyID=== environment.hospitalCode);
        }
      });
  };
}
