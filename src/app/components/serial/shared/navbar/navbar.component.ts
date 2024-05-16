import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ActiveLinkComponent } from "../active-link/active-link.component";
import { filter } from 'rxjs';
import { AuthService } from '../../../../services/serial/auth.service';
import { DataService } from '../../../../services/serial/data.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  imports: [CommonModule, RouterLink, ActiveLinkComponent]
})
export class NavbarComponent {
  authService = inject(AuthService);
  dataService = inject(DataService);
  router = inject(Router);
  location = inject(Location);
  user: any;
  fullUrl!: string;
  jsonData: any;
  isMenuOpen = false;

  constructor(){
    this.user = this.authService.getUser();
  }

  checkRoles(roleId: any) {
    const result = this.user?.roleIds?.find((role: any) => role == roleId)
    return result;
  }

  ngOnInit(): void {
    this.dataService.getJsonData().subscribe(data => {
      this.jsonData = data;
    });
    // Subscribe to router events
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd) // Filter only NavigationEnd events
      )
      .subscribe(() => {
        // Update fullUrl when route changes
        this.fullUrl = this.location.prepareExternalUrl(this.location.path());
      });

    // Initialize fullUrl
    this.fullUrl = this.location.prepareExternalUrl(this.location.path());
  }

  logOut() {
    this.authService.deleteUser();

    // Reload the current route
    window.location.reload();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  redirectToHome(): void {
    this.router.navigateByUrl('/');
  }

}
