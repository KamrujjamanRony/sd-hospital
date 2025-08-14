import { Component, inject, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ImgbbService } from '../../../../../services/serial/imgbb.service';
import { environment } from '../../../../../../environments/environments';
import { DepartmentService } from '../../../../../services/serial/department.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-department-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-department-modal.component.html',
  styleUrl: './edit-department-modal.component.css'
})
export class EditDepartmentModalComponent implements OnInit {
  @Input() id!: any;
  @Output() closeModal = new EventEmitter<void>();
  departmentService = inject(DepartmentService);
  imgbbService = inject(ImgbbService);
  fb = inject(FormBuilder);
  private subscriptions: Subscription[] = [];
  selected = signal<any>(null);
  isSubmitted = signal<boolean>(false);

  ngOnInit(): void {
    this.loadDepartment();
  }

  loadDepartment(): void {
    this.subscriptions.push(
      this.departmentService.getDepartmentById(this.id).subscribe(department => {
        this.selected.set(department);
        this.updateFormValues();
      })
    );
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
    if (this.selected()) {
      this.editDepartmentForm.patchValue({
        companyID: this.selected().companyID,
        departmentName: this.selected().departmentName,
        description: this.selected().description,
        imgUrl: this.selected().imgUrl,
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

    this.subscriptions.push(
      this.departmentService.updateDepartment(this.selected().id, formData).subscribe({
        next: () => {
          this.closeThisModal();
        },
        error: (error) => {
          console.error('Error updating department:', error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}