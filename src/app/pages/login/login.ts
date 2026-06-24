import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { form, schema, required, minLength, FormField } from '@angular/forms/signals';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Router } from '@angular/router';
import { AuthService } from '../../services/serial/auth.service';
import { UserAuthService } from '../../services/serial/userAuth.service';
import { JsonDataService } from '../../services/main/json-data.service';
import { AlertService } from '../../services/alert.service';

interface LoginModel {
  companyID: number | string;
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private userAuthService = inject(UserAuthService);
  private dataService = inject(JsonDataService);
  private router = inject(Router);
  private alert = inject(AlertService);

  private subscriptions: Subscription[] = [];
  isSubmitted = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  user = signal<any>(null);
  loading = signal<boolean>(false);
  name = signal<string>('');
  error = signal<string>('');

  private model = signal<LoginModel>({
    companyID: environment.hospitalCode,
    username: '',
    password: ''
  });

  loginForm = form<LoginModel>(this.model, (p) => {
    required(p.username, { message: 'Username is required' });
    minLength(p.username, 3, { message: 'Username must be at least 3 characters' });
    required(p.password, { message: 'Password is required' });
    minLength(p.password, 4, { message: 'Password must be at least 4 characters' });
  });

  constructor() {
    this.user.set(this.authService.getUser());
  }

  ngOnInit(): void {
    this.dataService.getHeader().subscribe((data) => {
      this.name.set(data.name);
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.isSubmitted.set(true);

    if (!this.loginForm().valid()) {
      const messages: string[] = [];
      const u = this.loginForm.username();
      const p = this.loginForm.password();
      if (!u.valid()) u.errors().forEach((e) => messages.push(e.message || e.kind));
      if (!p.valid()) p.errors().forEach((e) => messages.push(e.message || e.kind));
      this.alert.validationWarning(messages);
      return;
    }

    this.isSubmitting.set(true);
    this.loading.set(true);
    const { username, password } = this.loginForm().value();
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
          this.isSubmitting.set(false);
          this.loading.set(false);
          this.alert.success('Login successful', `Welcome ${response.username || ''}`).then(() => {
            this.router.navigate(['/serial']);
          });
        },
        error: (error) => {
          console.error('Login error:', error);
          const msg =
            (error?.error?.status ?? '') + ' : ' + (error?.error?.title ?? 'An error occurred during login.');
          this.error.set(msg);
          this.isSubmitting.set(false);
          this.loading.set(false);
          this.alert.error('Login failed', error?.error?.title || 'Please check your credentials and try again.');
          setTimeout(() => {
            this.error.set('');
          }, 5000);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
