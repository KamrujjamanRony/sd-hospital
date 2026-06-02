import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCover } from './home-cover';

describe('HomeCover', () => {
  let component: HomeCover;
  let fixture: ComponentFixture<HomeCover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCover]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCover);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
