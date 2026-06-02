import { Component, inject, OnInit, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../components/serial/shared/page-header/page-header.component';

import { SerialCategoryComponent } from '../../../components/serial/serial-category/serial-category.component';
import { AppStore } from '../../../store/app.store';

@Component({
  selector: 'app-departments',
  standalone: true,
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css',
  imports: [PageHeaderComponent, SerialCategoryComponent]
})
export class DepartmentsComponent {
  store = inject(AppStore);
}