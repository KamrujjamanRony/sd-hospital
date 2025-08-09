import { Component, inject, OnInit, OnDestroy } from '@angular/core';
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

  departments: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;
    this.error = null;

    this.subscriptions.push(
      this.departmentService.getDepartments().subscribe({
        next: (departments) => {
          this.departments = departments;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to load departments';
          this.loading = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}