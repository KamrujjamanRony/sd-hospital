import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { CategoryComponent } from '../../../components/main/shared/all-cards/category/category.component';
import { HomeCover } from "../../../components/main/home/home-cover/home-cover";
import { AppStore } from '../../../store/app.store';

@Component({
  selector: 'app-department',
  standalone: true,
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CategoryComponent, HomeCover]
})
export class DepartmentComponent {
  store = inject(AppStore)
  departments = this.store.departments;
}