import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CoverComponent } from '../../../../components/main/shared/cover/cover.component';
import { environment } from '../../../../../environments/environments';
import { AppStore } from '../../../../store/app.store';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CoverComponent, FormsModule]
})
export class AboutUsComponent {
  private store = inject(AppStore);
  router = inject(Router);

  aboutInfo = this.store.aboutUs;

  onFormSubmit(): void {
    if (!this.aboutInfo()?.id) {
      console.error('No about us ID found');
      return;
    }

    const formData = new FormData();

    // Use exact field names as expected by the API (case-sensitive)
    formData.append('CompanyID', environment.hospitalCode.toString());
    formData.append('Heading', this.aboutInfo()?.heading || '');
    formData.append('Title', this.aboutInfo()?.title || '');
    formData.append('Description', this.aboutInfo()?.description || '');
    formData.append('Title2', this.aboutInfo()?.title2 || '');
    formData.append('Description2', this.aboutInfo()?.description2 || '');
    formData.append('Title3', this.aboutInfo()?.title3 || '');
    formData.append('Description3', this.aboutInfo()?.description3 || '');
    formData.append('Title4', this.aboutInfo()?.title4 || '');
    formData.append('Description4', this.aboutInfo()?.description4 || '');
    formData.append('Title5', this.aboutInfo()?.title5 || '');
    formData.append('Description5', this.aboutInfo()?.description5 || '');

    // Use store to update about us
    this.store.updateAboutUs({
      id: this.aboutInfo()?.id,
      data: formData
    });

    this.router.navigate(['about']);
  }
}
