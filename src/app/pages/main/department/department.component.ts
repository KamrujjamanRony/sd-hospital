import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CategoryComponent } from '../../../components/main/shared/all-cards/category/category.component';
import { DepartmentService } from '../../../services/serial/department.service';

@Component({
  selector: 'app-department',
  standalone: true,
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
  imports: [CommonModule, CategoryComponent]
})
export class DepartmentComponent implements OnInit, OnDestroy {
  private departmentService = inject(DepartmentService);
  private subscriptions: Subscription[] = [];

  departments = signal<any[]>([]);
  loading = signal<boolean>(true);
  error = signal<any>(null);

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading.set(true);
    this.error.set(null);

    this.subscriptions.push(
      this.departmentService.getDepartments().subscribe({
        next: (departments) => {
          this.departments.set(departments);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.message || 'Failed to load departments');
          this.loading.set(false);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}