import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../components/serial/shared/navbar/navbar.component';
import { AuthService } from '../../../services/serial/auth.service';
import { UserAuthService } from '../../../services/serial/userAuth.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-serial-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, NavbarComponent, ReactiveFormsModule],
  templateUrl: './serial-main.component.html',
  styleUrls: ['./serial-main.component.css']
})
export class SerialMainComponent implements OnDestroy {
  private authService = inject(AuthService);
  private userAuthService = inject(UserAuthService);
  private fb = inject(FormBuilder);

  private subscriptions: Subscription[] = [];
  isSubmitted = signal<boolean>(false);
  user = signal<any>(null);

  constructor() {
    this.user.set(this.authService.getUser());
  }

  userForm = this.fb.group({
    companyID: [environment.hospitalCode],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  showError(controlName: string): boolean {
    const control = this.userForm.get(controlName);
    return !!control?.invalid && (control?.dirty || control?.touched || this.isSubmitted());
  }

  onSubmit(): void {
    this.isSubmitted.set(true);

    if (this.userForm.invalid) {
      return;
    }

    const { username, password } = this.userForm.value;
    const loginData = {
      username: username || '',
      password: environment.userCode + (password || '')
    };

    this.subscriptions.push(
      this.userAuthService.loginUser(loginData).subscribe({
        next: (response: any) => {
          const userModel = {
            token: response.token,
            username: response.username,
            roleIds: response.roleIds
          };
          this.authService.setUser(userModel);
          this.user.set(userModel);
        },
        error: (error) => {
          console.error('Login error:', error);
          // You could add error handling logic here (show error message to user)
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}