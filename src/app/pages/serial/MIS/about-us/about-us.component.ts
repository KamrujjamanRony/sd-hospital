import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CoverComponent } from '../../../../components/main/shared/cover/cover.component';
import { AboutService } from '../../../../services/main/about.service';
import { environment } from '../../../../../environments/environments';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  standalone: true,
  imports: [CoverComponent, FormsModule]
})
export class AboutUsComponent implements OnInit, OnDestroy {
  aboutService = inject(AboutService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  aboutInfo?: any;
  paramsSubscription?: Subscription;
  editAboutUsSubscription?: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.aboutService.getCompanyAbout()
      .subscribe({
        next: (response) => {
          this.aboutInfo = response;
        }
      });
  }

  onFormSubmit(): void {

    const formData = new FormData();

    formData.append('companyID', environment.hospitalCode.toString());
    formData.append('heading', this.aboutInfo?.heading ?? '');
    formData.append('title', this.aboutInfo?.title ?? '');
    formData.append('description', this.aboutInfo?.description ?? '');
    formData.append('title2', this.aboutInfo?.title2 ?? '');
    formData.append('description2', this.aboutInfo?.description2 ?? '');
    formData.append('title3', this.aboutInfo?.title3 ?? '');
    formData.append('description3', this.aboutInfo?.description3 ?? '');
    formData.append('title4', this.aboutInfo?.title4 ?? '');
    formData.append('description4', this.aboutInfo?.description4 ?? '');
    formData.append('title5', this.aboutInfo?.title5 ?? '');
    formData.append('description5', this.aboutInfo?.description5 ?? '');

    if (this.aboutInfo.id) {
      this.editAboutUsSubscription = this.aboutService.updateAbout(this.aboutInfo.id, formData)
        .subscribe({
          next: (response) => {
            this.router.navigate(['about']);
          }
        });
    }
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editAboutUsSubscription?.unsubscribe();
  }

}
