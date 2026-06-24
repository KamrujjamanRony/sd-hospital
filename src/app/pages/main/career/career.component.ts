import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { NewsCardComponent } from '../../../components/main/shared/all-cards/news-card/news-card.component';
import { Observable } from 'rxjs';
import { CareerService } from '../../../services/main/career.service';
import { HomeCover } from "../../../components/main/home/home-cover/home-cover";

@Component({
  selector: 'app-career',
  imports: [NewsCardComponent, HomeCover],
  templateUrl: './career.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './career.component.css'
})
export class CareerComponent {
  careerService = inject(CareerService);
  career = signal<any[]>([]);

  constructor() { }

  ngOnInit(): void {
    this.careerService.getCompanyCareer().subscribe(data => {
      this.career.set(data);
    })
  }

}
