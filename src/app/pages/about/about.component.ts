import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CoverComponent } from '../../components/shared/cover/cover.component';
import { AboutService } from '../../features/services/about.service';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  standalone: true,
  imports: [CoverComponent]
})
export class AboutComponent implements OnInit {
  yourTitle: any = "";
  yourSub1: any = 'Home';
  yourSub2: any = 'About Us';
  
  allAbout$?: Observable<any[]>;
  about!: any;

  constructor(private aboutService: AboutService) { }
  
  ngOnInit(): void {
    this.allAbout$ = this.aboutService.getAllAbout();
      this.allAbout$.subscribe(aboutUs => {
        if (aboutUs) {
          this.about = aboutUs.find(a=>a.companyID=== environment.hospitalCode);
        }
      });
  };
}
