import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { ImgbbService } from '../../../../../services/serial/imgbb.service';
import { environment } from '../../../../../../environments/environments';
import { DepartmentService } from '../../../../../services/serial/department.service';

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
  queryClient = injectQueryClient();
  private addDepartmentSubscription?: Subscription;

  closeThisModal(): void {
    this.closeModal.emit();
  }

  isSubmitted = false;

  constructor(){}

  mutation = injectMutation((client) => ({
    mutationFn: (formData: any) => this.departmentService.addDepartment(formData),
    onSuccess: () => {
      // Invalidate and refetch by using the client directly
      client.invalidateQueries({ queryKey: ['departments'] })
    },
  }));

  addDepartmentForm = this.fb.group({
    departmentName: ['', Validators.required],
    description: [''],
    imgUrl: [''],
  });

  onSubmit(): void {
    const {departmentName, description, imgUrl} = this.addDepartmentForm.value;
    if (departmentName) {
      
    const formData = new FormData();

    formData.append('CompanyID', environment.hospitalCode.toString());
    formData.append('DepartmentName', departmentName);
    formData.append('Description',  description != null ? description.toString() : '');
    formData.append('ImgUrl', imgUrl || '');
      this.mutation.mutate(formData);
      this.closeThisModal();
    }
    this.isSubmitted = true;
  }

  ngOnDestroy(): void {
    this.addDepartmentSubscription?.unsubscribe();
  }
}
