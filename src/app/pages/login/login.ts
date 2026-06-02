
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Router } from '@angular/router';
import { AuthService } from '../../services/serial/auth.service';
import { UserAuthService } from '../../services/serial/userAuth.service';
import { JsonDataService } from '../../services/main/json-data.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private userAuthService = inject(UserAuthService);
  private dataService = inject(JsonDataService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  private subscriptions: Subscription[] = [];
  isSubmitted = signal<boolean>(false);
  user = signal<any>(null);
  loading = signal<boolean>(false);
  name = signal<string>("");
  error = signal<string>("");

  constructor() {
    this.user.set(this.authService.getUser());
  }

  ngOnInit(): void {
    this.dataService.getHeader().subscribe(data => {
      this.name.set(data.name);
    });
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
    this.loading.set(true);

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
          this.loading.set(false);
          this.router.navigate(['/serial']);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.error.set(error?.error?.status + ' : ' + error?.error?.title || 'An error occurred during login.');
          this.loading.set(false);
          setTimeout(() => { this.error.set(''); }, 5000);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
