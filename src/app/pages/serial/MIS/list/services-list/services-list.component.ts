import { Component, inject } from '@angular/core';
import { environment } from '../../../../../../environments/environments';
import { CoverComponent } from "../../../../../components/main/shared/cover/cover.component";
import { RouterLink } from '@angular/router';
import { AppStore } from '../../../../../store/app.store';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.css',
  imports: [CoverComponent, RouterLink]
})
export class ServicesListComponent {
  store = inject(AppStore);
  emptyImg: any = environment.emptyImg;
  services = this.store.services;

  onDelete(id: any): void {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.store.deleteService(id);
    }
  }
}
