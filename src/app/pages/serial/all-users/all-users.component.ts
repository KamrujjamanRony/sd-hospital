import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { CoverComponent } from '../../../components/serial/shared/cover/cover.component';
import { AddUserModalComponent } from '../../../components/serial/shared/modal/add-user-modal/add-user-modal.component';
import { EditUserModalComponent } from '../../../components/serial/shared/modal/edit-user-modal/edit-user-modal.component';
import { UsersService } from '../../../services/serial/users.service';
import { AuthService } from '../../../services/serial/auth.service';
import { DataService } from '../../../services/serial/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-users',
  standalone: true,
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css',
  imports: [CommonModule, CoverComponent, AddUserModalComponent, EditUserModalComponent]
})
export class AllUsersComponent implements OnInit, OnDestroy {
  usersService = inject(UsersService);
  dataService = inject(DataService);
  authService = inject(AuthService);

  user: any;
  selected: any;
  addUserModal: boolean = false;
  editUserModal: boolean = false;
  userRole: any[] = [];
  users: any[] = [];
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadData();
  }

  loadData(): void {
    this.subscriptions.push(
      forkJoin([
        this.usersService.getUsers(),
        this.dataService.getJsonData()
      ]).subscribe({
        next: ([users, data]) => {
          this.users = users;
          this.userRole = data.role;
        },
        error: (error) => {
          console.error('Error loading data:', error);
        }
      })
    );
  }

  checkRoles(roleId: any): boolean {
    return this.user?.roleIds?.includes(roleId);
  }

  getRolesName(roleId: any): string {
    const role = this.userRole.find(r => r.id == roleId);
    return role?.name || '';
  }

  openAddUserModal(): void {
    this.addUserModal = true;
  }

  openEditUserModal(id: any): void {
    this.selected = id;
    this.editUserModal = true;
  }

  closeAddUserModal(): void {
    this.addUserModal = false;
    this.loadData(); // Refresh the list after adding
  }

  closeEditUserModal(): void {
    this.editUserModal = false;
    this.loadData(); // Refresh the list after editing
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}