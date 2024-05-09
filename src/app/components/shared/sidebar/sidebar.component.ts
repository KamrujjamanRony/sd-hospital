import { Observable } from 'rxjs';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environments';
import { AboutService } from '../../../features/services/main/about.service';
import { ContactService } from '../../../features/services/main/contact.service';
import { AuthService } from '../../../features/services/serial/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [RouterLink]
})
export class SidebarComponent implements OnInit {
  authService = inject(AuthService);
  user: any;
  companyID: any = environment.hospitalCode.toString();
  allAbout$?: Observable<any[]>;
  allAddress$?: Observable<any[]>;
  about!: any;
  address!: any;
  constructor(private aboutService: AboutService, private contactService: ContactService) { }
  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.allAbout$ = this.aboutService.getAllAbout();
    this.allAbout$.subscribe(aboutUs => {
      if (aboutUs) {
        this.about = aboutUs.find(a => a.companyID === this.companyID);
      }
    });
    this.allAddress$ = this.contactService.getCompanyAddress();
    this.allAddress$.subscribe(addressUs => {
      if (addressUs) {
        this.address = addressUs;
      }
    });
  }

  checkRoles(roleId: any) {
    const result = this.user?.roleIds?.find((role: any) => role == roleId)
    return result;
  }

}
