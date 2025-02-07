import { Component, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { PageHeaderComponent } from '../../../components/serial/shared/page-header/page-header.component';
import { CategoryComponent } from '../../../components/serial/category/category.component';
import { DepartmentService } from '../../../services/serial/department.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css',
  imports: [PageHeaderComponent, CategoryComponent]
})
export class DepartmentsComponent {
  departmentService = inject(DepartmentService)

  constructor() { }

  ngOnInit(): void { }

  query = injectQuery(() => ({
    queryKey: ['departments'],
    queryFn: () => this.departmentService.getDepartments(),
  }))
}
