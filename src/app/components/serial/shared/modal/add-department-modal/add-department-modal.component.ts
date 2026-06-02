import { Component, inject, Output, EventEmitter, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environments';

import { AppStore } from '../../../../../store/app.store';

@Component({
  selector: 'app-add-department-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './add-department-modal.component.html',
  styleUrl: './add-department-modal.component.css'
})
export class AddDepartmentModalComponent {
  @Output() closeModal = new EventEmitter<void>();

  store = inject(AppStore);
  fb = inject(FormBuilder);

  isSubmitted = signal<boolean>(false);

  closeThisModal(): void {
    this.closeModal.emit();
  }

  addDepartmentForm = this.fb.group({
    departmentName: ['', Validators.required],
    description: [''],
    imgUrl: [''],
  });

  onSubmit(): void {
    if (this.addDepartmentForm.invalid) {
      this.isSubmitted.set(true);
      return;
    }

    const { departmentName, description, imgUrl } = this.addDepartmentForm.value;
    const formData = new FormData();

    formData.append('CompanyID', environment.hospitalCode.toString());
    formData.append('DepartmentName', departmentName || '');
    formData.append('Description', description || '');
    formData.append('ImgUrl', imgUrl || '');

    // Use store to add department - automatically updates global state
    this.store.addDepartment(formData);
    this.closeThisModal();
  }
}