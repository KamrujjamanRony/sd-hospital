import { Component, OnDestroy, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CoverComponent } from '../../../../components/main/shared/cover/cover.component';
import { ContactService } from '../../../../services/main/contact.service';
import { environment } from '../../../../../environments/environments';
import { AppStore } from '../../../../store/app.store';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CoverComponent, FormsModule]
})
export class ContactUsComponent {
  private store = inject(AppStore);
  router = inject(Router);
  addressInfo = this.store.address;

  onFormSubmit(): void {
    if (!this.addressInfo()?.id) {
      console.error('No address ID found');
      return;
    }
    const formData = new FormData();
    formData.append('companyID', environment.hospitalCode.toString());
    formData.append('address1', this.addressInfo()?.address1 || '');
    formData.append('address2', this.addressInfo()?.address2 || '');
    formData.append('phoneNumber1', this.addressInfo()?.phoneNumber1 || '');
    formData.append('phoneNumber2', this.addressInfo()?.phoneNumber2 || '');
    formData.append('phoneNumber3', this.addressInfo()?.phoneNumber3 || '');
    formData.append('email', this.addressInfo()?.email || '');
    formData.append('facebookLink', this.addressInfo()?.facebookLink || '');
    formData.append('othersLink1', this.addressInfo()?.othersLink1 || '');
    formData.append('othersLink2', this.addressInfo()?.othersLink2 || '');

    // Use store to update about us
    this.store.updateAddress({
      id: this.addressInfo()?.id,
      data: formData
    });
    this.router.navigate(['contact']);
  };
}
