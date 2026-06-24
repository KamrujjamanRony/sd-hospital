import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CoverComponent } from '../../../components/serial/shared/cover/cover.component';
import { AddUserModalComponent } from '../../../components/serial/shared/modal/add-user-modal/add-user-modal.component';
import { EditUserModalComponent } from '../../../components/serial/shared/modal/edit-user-modal/edit-user-modal.component';

import { AppStore } from '../../../store/app.store';
import { DataService } from '../../../services/serial/data.service';
import { AuthService } from '../../../services/serial/auth.service';

@Component({
  selector: 'app-all-users',
  standalone: true,
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CoverComponent, AddUserModalComponent, EditUserModalComponent]
})
export class AllUsersComponent implements OnInit {
  store = inject(AppStore);
  dataService = inject(DataService);
  authService = inject(AuthService);

  user = signal<any>(null);
  selectedId = signal<any>(null);
  addUserModal = signal<boolean>(false);
  editUserModal = signal<boolean>(false);
  userRole = signal<any[]>([]);

  // Computed signal for user roles from data service
  userRoles = computed(() => this.userRole());

  ngOnInit(): void {
    this.user.set(this.authService.getUser());
    this.loadUserRoles();
    // No need to load users - they're already in store from app initialization
  }

  loadUserRoles(): void {
    this.dataService.getJsonData().subscribe({
      next: (data) => {
        this.userRole.set(data.role || []);
      },
      error: (error) => {
        console.error('Error loading user roles:', error);
      }
    });
  }

  checkRoles(roleId: any): boolean {
    return this.user()?.roleIds?.includes(roleId);
  }

  getRolesName(roleId: any): string {
    const role = this.userRole().find(r => r.id == roleId);
    return role?.name || '';
  }

  openAddUserModal(): void {
    this.addUserModal.set(true);
  }

  openEditUserModal(userId: any): void {
    console.log('Opening edit modal for userId:', userId);
    this.selectedId.set(userId);
    this.editUserModal.set(true);
  }

  closeAddUserModal(): void {
    this.addUserModal.set(false);
    // No need to refresh - state is automatically updated
  }

  closeEditUserModal(): void {
    this.editUserModal.set(false);
    // No need to refresh - state is automatically updated
  }
}