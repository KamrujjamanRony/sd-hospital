import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {
    success(title: string, text = ''): Promise<SweetAlertResult> {
        return Swal.fire({
            icon: 'success',
            title,
            text,
            timer: 2200,
            timerProgressBar: true,
            showConfirmButton: false
        });
    }

    error(title: string, text = ''): Promise<SweetAlertResult> {
        return Swal.fire({
            icon: 'error',
            title,
            text,
            confirmButtonColor: '#dc2626'
        });
    }

    warning(title: string, text = ''): Promise<SweetAlertResult> {
        return Swal.fire({
            icon: 'warning',
            title,
            text,
            confirmButtonColor: '#d97706'
        });
    }

    info(title: string, text = ''): Promise<SweetAlertResult> {
        return Swal.fire({ icon: 'info', title, text });
    }

    validationWarning(messages: string[]): Promise<SweetAlertResult> {
        const html = messages.length
            ? `<ul style="text-align:left;margin:0;padding-left:1.2rem">${messages
                .map((m) => `<li>${m}</li>`)
                .join('')}</ul>`
            : 'Please fill in the required fields correctly.';
        return Swal.fire({
            icon: 'warning',
            title: 'Please fix the highlighted fields',
            html,
            confirmButtonColor: '#d97706'
        });
    }

    confirm(title: string, text = '', confirmText = 'Yes'): Promise<SweetAlertResult> {
        return Swal.fire({
            icon: 'question',
            title,
            text,
            showCancelButton: true,
            confirmButtonText: confirmText,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#6b7280'
        });
    }
}
