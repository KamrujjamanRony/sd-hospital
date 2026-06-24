import { Component, inject, Input, Output, EventEmitter, OnInit, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { form, required, minLength, FormField } from '@angular/forms/signals';
import { environment } from '../../../../../../environments/environments';
import { AppStore } from '../../../../../store/app.store';
import { AlertService } from '../../../../../services/alert.service';

interface EditDepartmentModel {
    companyID: number | string;
    departmentName: string;
    description: string;
    imgUrl: string;
}

@Component({
    selector: 'app-edit-department-modal',
    standalone: true,
    imports: [FormField],
    templateUrl: './edit-department-modal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './edit-department-modal.component.css'
})
export class EditDepartmentModalComponent implements OnInit {
    @Input() id!: any;
    @Output() closeModal = new EventEmitter<void>();

    store = inject(AppStore);
    alert = inject(AlertService);

    isSubmitted = signal<boolean>(false);
    isSubmitting = signal<boolean>(false);

    selectedDepartment = computed(() => {
        const departments = this.store.departments();
        const idVal = typeof this.id === 'function' ? this.id() : this.id;
        return departments.find((dept) => dept.id === idVal);
    });

    private model = signal<EditDepartmentModel>({
        companyID: environment.hospitalCode,
        departmentName: '',
        description: '',
        imgUrl: ''
    });

    editDepartmentForm = form<EditDepartmentModel>(this.model, (p) => {
        required(p.departmentName, { message: 'Department name is required' });
        minLength(p.departmentName, 2, { message: 'Department name must be at least 2 characters' });
    });

    constructor() {
        effect(() => {
            const dept = this.selectedDepartment();
            if (dept) {
                this.model.set({
                    companyID: dept.companyID ?? environment.hospitalCode,
                    departmentName: dept.departmentName ?? '',
                    description: dept.description ?? '',
                    imgUrl: dept.imgUrl ?? ''
                });
            }
        });
    }

    ngOnInit(): void { }

    closeThisModal(): void {
        this.closeModal.emit();
    }

    onSubmit(event: Event): void {
        event.preventDefault();
        this.isSubmitted.set(true);

        if (!this.editDepartmentForm().valid()) {
            const msgs = this.editDepartmentForm.departmentName().errors().map((e) => e.message || e.kind);
            this.alert.validationWarning(msgs);
            return;
        }

        this.isSubmitting.set(true);
        const formValue = this.editDepartmentForm().value();
        const formData = new FormData();

        Object.keys(formValue).forEach((key) => {
            const value = (formValue as any)[key];
            if (value !== null && value !== undefined) {
                formData.append(key, value.toString());
            }
        });

        const idVal = typeof this.id === 'function' ? this.id() : this.id;
        try {
            this.store.updateDepartment({ id: idVal, data: formData });
            this.alert.success('Department updated', `"${formValue.departmentName}" has been updated.`);
            this.closeThisModal();
        } catch (err: any) {
            this.alert.error('Failed to update department', err?.message || 'Please try again.');
        } finally {
            this.isSubmitting.set(false);
        }
    }
}
