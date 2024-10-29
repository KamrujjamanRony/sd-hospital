import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../../../services/serial/users.service';
import { DataService } from '../../../../../services/serial/data.service';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-user-modal.component.html',
  styleUrl: './edit-user-modal.component.css'
})
export class EditUserModalComponent {
  @Input() user!: any;
  @Output() closeModal = new EventEmitter<void>();
  UsersService = inject(UsersService);
  dataService = inject(DataService);
  fb = inject(FormBuilder);
  queryClient = injectQueryClient();
  selected!: any;
  selectedRoles!: any;
  private editUserSubscription?: Subscription;

  closeThisModal(): void {
    this.closeModal.emit();
  }

  
  isSubmitted = false;
  userRole: any = [];

  constructor() { }

  ngOnInit(): void {
    this.dataService.getJsonData().subscribe(data => {
      this.userRole = data.role;
      this.updateFormValues();
    });
  }




  mutation = injectMutation((client) => ({
    mutationFn: (updateData: any) => this.UsersService.updateUser(this.user.userId, updateData),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['users'] })
    },
  }));

  addUserForm = this.fb.group({
    role: new FormControl([] as string[], Validators.required),
  });

  updateFormValues(): void {
    if (this.user) {
      this.addUserForm.patchValue({
        role: this.user?.roleIds,
      });
    }
  }

  onSubmit(): void {
    const { role } = this.addUserForm.value;
    if (role) {
      this.mutation.mutate(role);
      this.closeThisModal();
    }
    this.isSubmitted = true;
  };

  ngOnDestroy(): void {
    this.editUserSubscription?.unsubscribe();
  }

}
