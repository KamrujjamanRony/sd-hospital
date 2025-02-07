import { Component, inject } from '@angular/core';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { CoverComponent } from '../../../components/serial/shared/cover/cover.component';
import { AddUserModalComponent } from '../../../components/serial/shared/modal/add-user-modal/add-user-modal.component';
import { EditUserModalComponent } from '../../../components/serial/shared/modal/edit-user-modal/edit-user-modal.component';
import { UsersService } from '../../../services/serial/users.service';
import { AuthService } from '../../../services/serial/auth.service';
import { DataService } from '../../../services/serial/data.service';

@Component({
    selector: 'app-all-users',
    templateUrl: './all-users.component.html',
    styleUrl: './all-users.component.css',
    imports: [CoverComponent, AddUserModalComponent, EditUserModalComponent]
})
export class AllUsersComponent {
  usersService = inject(UsersService);
  dataService = inject(DataService);
  queryClient = injectQueryClient();
  authService = inject(AuthService);
  user: any;
  selected: any;
  addUserModal: boolean = false;
  editUserModal: boolean = false;
  userRole: any = [];
  private UserSubscription?: Subscription;
  
  query = injectQuery(() => ({
    queryKey: ['users'],
    queryFn: () => this.usersService.getUsers(),
  }));

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.dataService.getJsonData().subscribe(data => {
      this.userRole = data.role;
    });
  }

  checkRoles(roleId: any) {
    const result = this.user?.roleIds?.find((role: any) => role == roleId)
    return result;
  }

  getRolesName(roleId: any): any {
    const roleName = this.userRole.find((role: any) => role.id == roleId);
    return roleName?.name;
  }

  openAddUserModal() {
    this.addUserModal = true;
  }

  openEditUserModal(id: any) {
    this.selected = id;
    this.editUserModal = true;
  }

  closeAddUserModal() {
    this.addUserModal = false;
  }

  closeEditUserModal() {
    this.editUserModal = false;
  }

  ngOnDestroy(): void {
    this.UserSubscription?.unsubscribe();
  }

}
