import { Component, inject, Output, EventEmitter, signal, ChangeDetectionStrategy } from '@angular/core';
import { form, required, minLength } from '@angular/forms/signals';
import { FormField } from '@angular/forms/signals';
import { environment } from '../../../../../../environments/environments';
import { AppStore } from '../../../../../store/app.store';
import { AlertService } from '../../../../../services/alert.service';

interface DepartmentModel {
  departmentName: string;
  description: string;
  imgUrl: string;
}

@Component({
  selector: 'app-add-department-modal',
  standalone: true,
  imports: [FormField],
  templateUrl: './add-department-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './add-department-modal.component.css'
})
export class AddDepartmentModalComponent {
  @Output() closeModal = new EventEmitter<void>();

  store = inject(AppStore);
  alert = inject(AlertService);

  isSubmitted = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  private model = signal<DepartmentModel>({
    departmentName: '',
    description: '',
    imgUrl: ''
  });

  addDepartmentForm = form<DepartmentModel>(this.model, (p) => {
    required(p.departmentName, { message: 'Department name is required' });
    minLength(p.departmentName, 2, { message: 'Department name must be at least 2 characters' });
  });

  closeThisModal(): void {
    this.closeModal.emit();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.isSubmitted.set(true);

    if (!this.addDepartmentForm().valid()) {
      const msgs = this.addDepartmentForm.departmentName().errors().map((e) => e.message || e.kind);
      this.alert.validationWarning(msgs);
      return;
    }

    this.isSubmitting.set(true);
    const { departmentName, description, imgUrl } = this.addDepartmentForm().value();
    const formData = new FormData();

    formData.append('CompanyID', environment.hospitalCode.toString());
    formData.append('DepartmentName', departmentName || '');
    formData.append('Description', description || '');
    formData.append('ImgUrl', imgUrl || '');

    try {
      this.store.addDepartment(formData);
      this.alert.success('Department added', `"${departmentName}" has been added.`);
      this.closeThisModal();
    } catch (err: any) {
      this.alert.error('Failed to add department', err?.message || 'Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
