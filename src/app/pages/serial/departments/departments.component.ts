import { Component, inject } from '@angular/core';
import { TbDental } from "react-icons/tb";
import { MdMonitorHeart } from "react-icons/md";
import { FaHouseChimneyMedical } from "react-icons/fa6";
import { FaBriefcaseMedical } from "react-icons/fa6";
import { FaHandHoldingMedical } from "react-icons/fa";
import { FaMicroscope } from "react-icons/fa";
import { injectQuery } from '@tanstack/angular-query-experimental';
import { PageHeaderComponent } from '../../../components/serial/shared/page-header/page-header.component';
import { CategoryComponent } from '../../../components/serial/category/category.component';
import { ReactIconComponent } from '../../../components/serial/shared/react-icon/react-icon.component';
import { NavbarComponent } from '../../../components/serial/shared/navbar/navbar.component';
import { DepartmentService } from '../../../services/serial/department.service';

@Component({
    selector: 'app-departments',
    standalone: true,
    templateUrl: './departments.component.html',
    styleUrl: './departments.component.css',
    imports: [PageHeaderComponent, CategoryComponent, ReactIconComponent, NavbarComponent]
})
export class DepartmentsComponent {
  departmentService = inject(DepartmentService)
  icons = { TbDental, MdMonitorHeart, FaHouseChimneyMedical, FaBriefcaseMedical, FaHandHoldingMedical, FaMicroscope };

  constructor() { }

  ngOnInit(): void {}

  query = injectQuery(() => ({
    queryKey: ['departments'],
    queryFn: () => this.departmentService.getDepartments(),
  }))
}
