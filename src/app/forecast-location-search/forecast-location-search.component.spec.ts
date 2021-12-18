import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastForecastLocationSearchComponent } from './forecast-location-search.component';

describe('ForecastForecastLocationSearchComponent', () => {
  let component: ForecastForecastLocationSearchComponent;
  let fixture: ComponentFixture<ForecastForecastLocationSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForecastForecastLocationSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastForecastLocationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
