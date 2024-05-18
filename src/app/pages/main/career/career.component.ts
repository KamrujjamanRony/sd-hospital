import { Component, inject } from '@angular/core';
import { NewsCardComponent } from '../../../components/main/shared/all-cards/news-card/news-card.component';
import { CoverComponent } from '../../../components/main/shared/cover/cover.component';
import { Observable } from 'rxjs';
import { CareerService } from '../../../services/main/career.service';

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [NewsCardComponent, CoverComponent],
  templateUrl: './career.component.html',
  styleUrl: './career.component.css'
})
export class CareerComponent {
  careerService = inject(CareerService);

  career$?: Observable<any[]>;
  career?: any;

  constructor() { }

  ngOnInit(): void {
    this.career$ = this.careerService.getCompanyCareer();
    this.career$.subscribe(data => {
      this.career = data;
    })
  }

}
