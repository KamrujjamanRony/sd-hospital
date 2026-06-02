import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { AppStore } from '../../../../../store/app.store';

@Component({
  selector: 'app-edit-carousel',
  templateUrl: './edit-carousel.component.html',
  imports: [CoverComponent, FormsModule]
})
export class EditCarouselComponent {
  store = inject(AppStore);
  route = inject(ActivatedRoute);
  router = inject(Router);
  paramsSubscription?: Subscription;

  id = signal<any>(null);
  carouselInfo = signal<any>({});

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id.set(params.get('id'));
        if (this.id()) {
          this.carouselInfo.set(this.store.getCarouselById(this.id()));
        }
      }
    });
  }

  onFormSubmit(): void {

    const formData = new FormData();

    formData.append('CompanyID', this.carouselInfo().companyID);
    formData.append('Title', this.carouselInfo().title);
    formData.append('Description', this.carouselInfo().description);
    formData.append('ImageUrl', this.carouselInfo().imageUrl);

    if (this.id()) {
      // Use store to update Carousel - automatically updates global state
      this.store.updateCarousel({ id: this.id(), data: formData });
      this.router.navigate(['/serial/admin/all-mis/carousel']);
    }
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
  }
}
