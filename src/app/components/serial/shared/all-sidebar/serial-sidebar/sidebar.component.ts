import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../services/serial/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [RouterLink]
})
export class SidebarComponent {
  authService = inject(AuthService);
  user = signal<any>(null);

  constructor() { }

  ngOnInit(): void {
    this.user.set(this.authService.getUser());
  }

  checkRoles(roleId: any) {
    const result = this.user()?.roleIds?.find((role: any) => role == roleId)
    return result;
  }

}
