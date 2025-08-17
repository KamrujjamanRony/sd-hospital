import { Observable } from 'rxjs';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../../environments/environments';
import { AboutService } from '../../../../../services/main/about.service';
import { ContactService } from '../../../../../services/main/contact.service';
import { AuthService } from '../../../../../services/serial/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [RouterLink]
})
export class SidebarComponent implements OnInit {
  authService = inject(AuthService);
  aboutService = inject(AboutService);
  contactService = inject(ContactService);
  user = signal<any>(null);
  companyID: any = environment.hospitalCode.toString();
  about = signal<any>(null);
  address = signal<any>(null);

  constructor() { }

  ngOnInit(): void {
    this.user.set(this.authService.getUser());
    this.aboutService.getAllAbout().subscribe(aboutUs => {
      if (aboutUs) {
        this.about.set(aboutUs.find(a => a.companyID === this.companyID));
      }
    });
    this.contactService.getCompanyAddress().subscribe(addressUs => {
      if (addressUs) {
        this.address.set(addressUs);
      }
    });
  }

  checkRoles(roleId: any) {
    const result = this.user()?.roleIds?.find((role: any) => role == roleId)
    return result;
  }

}
