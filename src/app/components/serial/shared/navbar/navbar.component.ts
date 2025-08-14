import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ActiveLinkComponent } from "../active-link/active-link.component";
import { filter } from 'rxjs';
import { AuthService } from '../../../../services/serial/auth.service';
import { DataService } from '../../../../services/serial/data.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [ActiveLinkComponent]
})
export class NavbarComponent {
  authService = inject(AuthService);
  dataService = inject(DataService);
  router = inject(Router);
  location = inject(Location);
  user = signal<any>(null);
  fullUrl = signal<string>('');
  jsonData = signal<any>(null);
  isMenuOpen = signal<boolean>(false);

  constructor() { }

  ngOnInit(): void {
    this.user.set(this.authService.getUser());
    this.dataService.getJsonData().subscribe(data => {
      this.jsonData.set(data);
    });
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.fullUrl.set(this.location.prepareExternalUrl(this.location.path()));
      });
    this.fullUrl.set(this.location.prepareExternalUrl(this.location.path()));
  }

  checkRoles(roleId: any) {
    const result = this.user()?.roleIds?.find((role: any) => role == roleId)
    return result;
  }

  logOut() {
    this.authService.deleteUser();

    window.location.reload();
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  redirectToHome(): void {
    this.router.navigateByUrl('/');
  }

}
