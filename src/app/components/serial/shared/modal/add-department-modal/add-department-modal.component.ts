import { Component, inject, Output, EventEmitter, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ImgbbService } from '../../../../../services/serial/imgbb.service';
import { environment } from '../../../../../../environments/environments';
import { DepartmentService } from '../../../../../services/serial/department.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-department-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-department-modal.component.html',
  styleUrl: './add-department-modal.component.css'
})
export class AddDepartmentModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  departmentService = inject(DepartmentService);
  imgbbService = inject(ImgbbService);
  fb = inject(FormBuilder);
  private subscriptions: Subscription[] = [];
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

    this.subscriptions.push(
      this.departmentService.addDepartment(formData).subscribe({
        next: () => {
          this.closeThisModal();
        },
        error: (error) => {
          console.error('Error adding department:', error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}