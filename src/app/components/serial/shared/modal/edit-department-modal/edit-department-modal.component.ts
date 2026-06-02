import { Component, inject, Input, Output, EventEmitter, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environments';

import { AppStore } from '../../../../../store/app.store';

@Component({
  selector: 'app-edit-department-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './edit-department-modal.component.html',
  styleUrl: './edit-department-modal.component.css'
})
export class EditDepartmentModalComponent implements OnInit {
  @Input() id!: any;
  @Output() closeModal = new EventEmitter<void>();

  store = inject(AppStore);
  fb = inject(FormBuilder);

  isSubmitted = signal<boolean>(false);

  // Get the selected department from store using computed
  selectedDepartment = computed(() => {
    const departments = this.store.departments();
    return departments.find(dept => dept.id === this.id());
  });

  ngOnInit(): void {
    this.updateFormValues();
  }

  closeThisModal(): void {
    this.closeModal.emit();
  }

  editDepartmentForm = this.fb.group({
    companyID: [environment.hospitalCode, Validators.required],
    departmentName: ["", Validators.required],
    description: [""],
    imgUrl: [""],
  });

  updateFormValues(): void {
    const department = this.selectedDepartment();
    if (department) {
      this.editDepartmentForm.patchValue({
        companyID: department.companyID,
        departmentName: department.departmentName,
        description: department.description,
        imgUrl: department.imgUrl,
      });
    }
  }

  onSubmit(): void {
    if (this.editDepartmentForm.invalid) {
      this.isSubmitted.set(true);
      return;
    }

    const formData = new FormData();
    const formValue = this.editDepartmentForm.value;

    Object.keys(formValue).forEach(key => {
      const value = formValue[key as keyof typeof formValue];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    // Use store to update department - automatically updates global state
    this.store.updateDepartment({ id: this.id(), data: formData });
    this.closeThisModal();
  }
}