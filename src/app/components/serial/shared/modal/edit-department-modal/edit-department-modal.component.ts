import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ImgbbService } from '../../../../../services/serial/imgbb.service';
import { environment } from '../../../../../../environments/environments';
import { DepartmentService } from '../../../../../services/serial/department.service';

@Component({
    selector: 'app-edit-department-modal',
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './edit-department-modal.component.html',
    styleUrl: './edit-department-modal.component.css'
})
export class EditDepartmentModalComponent {
  readonly id = input.required<any>();
  readonly closeModal = output<void>();
  departmentService = inject(DepartmentService);
  imgbbService = inject(ImgbbService);
  fb = inject(FormBuilder);
  queryClient = injectQueryClient();
  selected!: any;
  private editDepartmentSubscription?: Subscription;

  closeThisModal(): void {
    this.closeModal.emit();
  }

  isSubmitted = false;

  constructor() { }

  ngOnInit(): void {
    this.selected = this.departmentService.getDepartment(this.id())
    this.updateFormValues();
  }



  mutation = injectMutation((client) => ({
    mutationFn: (updateData: any) => this.departmentService.updateDepartment(this.selected.id, updateData),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['departments'] })
    },
  }));

  addDepartmentForm = this.fb.group({
    companyID: [environment.hospitalCode, Validators.required],
    departmentName: ["", Validators.required],
    description: [""],
    imgUrl: [""],
  });

  updateFormValues(): void {
    if (this.selected) {
      this.addDepartmentForm.patchValue({
        departmentName: this.selected.departmentName,
        description: this.selected.description,
        imgUrl: this.selected.imgUrl,
      });
    }
  }

  onSubmit(): void {
    const { departmentName, description, imgUrl } = this.addDepartmentForm.value;
    if (departmentName) {
      const formData = new FormData();

      formData.append('CompanyID', environment.hospitalCode.toString());
      formData.append('DepartmentName', departmentName);
      formData.append('Description', description || '');
      formData.append('ImgUrl', imgUrl || '');
      this.mutation.mutate(formData);
      this.closeThisModal();
    }
    this.isSubmitted = true;
  };

  ngOnDestroy(): void {
    this.editDepartmentSubscription?.unsubscribe();
  }
}
