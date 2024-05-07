import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReactIconComponent } from '../../react-icon/react-icon.component';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
// import { UsersService } from '../../../../features/services/users.service';
import { ImCross } from "react-icons/im";
import { DataService } from '../../../../../features/services/serial/data.service';
import { environment } from '../../../../../../environments/environments';
import { UsersService } from '../../../../../features/services/serial/users.service';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReactIconComponent],
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

  ImCross = ImCross;
  isSubmitted = false;
  userRole: any = [];

  constructor() {
   }

  ngOnInit(): void {
    this.dataService.getJsonData().subscribe(data => {
      this.userRole = data.role;
      this.updateFormValues();
    });
    // this.UsersService.getUserRole(this.user).subscribe(roles => {
    //   this.selectedRoles = roles;
    //   console.log(this.selectedRoles)
    // });
    // this.selected = this.UsersService.getUser(this.id)
  }

  // selectedUser = injectQuery(() => ({
  //   queryKey: ['Users', this.id],
  //   queryFn: async () => {
  //     const response = await fetch(`${environment.UserApi}/${this.id}`);
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const data = await response.json();
  //     this.selected = data;
  //   },
  // }));



  mutation = injectMutation((client) => ({
    mutationFn: (updateData: any) => this.UsersService.updateUser(this.user.userId, updateData),
    onSuccess: () => {
      // Invalidate and refetch by using the client directly
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
    // console.log(this.addUserForm.value)
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
