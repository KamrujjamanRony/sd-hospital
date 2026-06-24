import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { HomeCover } from "../../../components/main/home/home-cover/home-cover";
import { AppStore } from '../../../store/app.store';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [HomeCover]
})
export class AboutComponent {
  private store = inject(AppStore);
  about = this.store.aboutUs;
}
