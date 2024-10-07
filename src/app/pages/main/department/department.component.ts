import { Component, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { PageHeaderComponent } from '../../../components/serial/shared/page-header/page-header.component';
import { NavbarComponent } from '../../../components/serial/shared/navbar/navbar.component';
import { CategoryComponent } from '../../../components/main/shared/all-cards/category/category.component';
import { DepartmentService } from '../../../services/serial/department.service';

@Component({
    selector: 'app-department',
    standalone: true,
    templateUrl: './department.component.html',
    styleUrl: './department.component.css',
    imports: [PageHeaderComponent, CategoryComponent, NavbarComponent]
})
export class DepartmentComponent {
  departmentService = inject(DepartmentService)

  constructor() { }

  ngOnInit(): void {}

  query = injectQuery(() => ({
    queryKey: ['departments'],
    queryFn: () => this.departmentService.getDepartments(),
  }))
}
