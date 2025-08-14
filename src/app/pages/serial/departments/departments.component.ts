import { Component, inject, OnInit, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../components/serial/shared/page-header/page-header.component';
import { DepartmentService } from '../../../services/serial/department.service';
import { CommonModule } from '@angular/common';
import { SerialCategoryComponent } from '../../../components/serial/serial-category/serial-category.component';

@Component({
  selector: 'app-departments',
  standalone: true,
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css',
  imports: [CommonModule, PageHeaderComponent, SerialCategoryComponent]
})
export class DepartmentsComponent implements OnInit {
  departmentService = inject(DepartmentService);
  departments = signal<any[]>([]);

  ngOnInit(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments.set(departments);
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });
  }
}