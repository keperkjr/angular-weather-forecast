import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureForecastComponent } from './future-forecast.component';

describe('FutureForecastComponent', () => {
  let component: FutureForecastComponent;
  let fixture: ComponentFixture<FutureForecastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FutureForecastComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FutureForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
