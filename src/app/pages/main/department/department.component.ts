import { Component, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { CategoryComponent } from '../../../components/main/shared/all-cards/category/category.component';
import { DepartmentService } from '../../../services/serial/department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrl: './department.component.css',
  imports: [CategoryComponent]
})
export class DepartmentComponent {
  departmentService = inject(DepartmentService)

  constructor() { }

  ngOnInit(): void { }

  query = injectQuery(() => ({
    queryKey: ['departments'],
    queryFn: () => this.departmentService.getDepartments(),
  }))
}
