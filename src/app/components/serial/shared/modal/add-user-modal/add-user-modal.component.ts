import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from "../confirm-modal/confirm-modal.component";
import { UserAuthService } from '../../../../../services/serial/userAuth.service';
import { environment } from '../../../../../../environments/environments';
import { DataService } from '../../../../../services/serial/data.service';

@Component({
    selector: 'app-add-user-modal',
    templateUrl: './add-user-modal.component.html',
    styleUrl: './add-user-modal.component.css',
    imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent]
})
export class AddUserModalComponent {
  readonly closeModal = output<void>();
  UserAuthService = inject(UserAuthService);
  dataService = inject(DataService);
  fb = inject(FormBuilder);
  queryClient = injectQueryClient();
  private addUsersSubscription?: Subscription;

  closeThisModal(): void {
    this.closeModal.emit();
  }

  isSubmitted = false;
  confirmModal: boolean = false;
  userRole: any = [];

  constructor() { }

  ngOnInit(): void {
    this.dataService.getJsonData().subscribe(data => {
      this.userRole = data.role;
    });
  }

  closeConfirmModal() {
    this.confirmModal = false;
  }

  mutation = injectMutation((client) => ({
    mutationFn: (formData: any) => this.UserAuthService.registerUser(formData),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['users'] });
      this.confirmModal = true;
      setTimeout(() => {
        this.closeThisModal();
      }, 3000);
    },
  }));

  addUsersForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    role: [[], Validators.required],
  });

  onSubmit(): void {
    const { username, password, role } = this.addUsersForm.value;
    if (username && password && role) {
      const formData = new FormData();

      formData.append('CompanyID', environment.hospitalCode.toString());
      formData.append('Username', username || '');
      formData.append('Password', environment.userCode + password || '');
      (role as any[]).map((roles: any) => {
        formData.append('Roles', roles || '');
      })
      this.mutation.mutate(formData);
    }
    this.isSubmitted = true;
  }

  ngOnDestroy(): void {
    this.addUsersSubscription?.unsubscribe();
  }

}
