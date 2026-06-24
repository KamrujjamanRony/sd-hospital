import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoverComponent } from '../../../../../components/main/shared/cover/cover.component';
import { environment } from '../../../../../../environments/environments';
import { AuthService } from '../../../../../services/serial/auth.service';
import { AppStore } from '../../../../../store/app.store';

@Component({
  selector: 'app-carousel-list',
  templateUrl: './carousel-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CoverComponent, RouterLink]
})
export class CarouselListComponent {
  authService = inject(AuthService);
  store = inject(AppStore);
  carousels = this.store.carousels;
  emptyImg: any = environment.emptyImg;
  user = signal<any>(null);

  ngOnInit(): void {
    this.user.set(this.authService.getUser());
  }

  checkRoles(roleId: any) {
    const result = this.user()?.roleIds?.find((role: any) => role == roleId);
    return result;
  }

  onDelete(id: any): void {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.store.deleteCarousel(id);
    }
  }
}
