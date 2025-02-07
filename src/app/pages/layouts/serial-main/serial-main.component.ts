import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../components/serial/shared/navbar/navbar.component';
import { AuthService } from '../../../services/serial/auth.service';
import { UserAuthService } from '../../../services/serial/userAuth.service';
import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-serial-main',
  imports: [CommonModule, RouterOutlet, FormsModule, NavbarComponent, ReactiveFormsModule],
  templateUrl: './serial-main.component.html',
  styleUrl: './serial-main.component.css'
})
export class SerialMainComponent {
  authService = inject(AuthService);
  UserAuthService = inject(UserAuthService);
  queryClient = injectQueryClient();
  fb = inject(FormBuilder);
  isSubmitted = false;
  user: any;
  private loginSubscription?: Subscription;

  constructor() {
    this.setUser();
  }

  userForm = this.fb.group({
    companyID: [environment.hospitalCode],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    let { username, password } = this.userForm.value;
    if (username && password) {
      password = environment.userCode + password;
      this.loginSubscription = this.UserAuthService.loginUser({ username, password })
        .subscribe({
          next: (response: any) => {
            const userModel = { token: response.token, username: response.username, roleIds: response.roleIds };
            this.authService.setUser(userModel);
            this.setUser();
          },
          error: (error) => {
            console.error('Error adding user:', error);
          }
        });
      this.isSubmitted = true;
    }
  };

  getLocation() {

  }

  setUser() {
    this.user = this.authService.getUser();
  }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }

}
