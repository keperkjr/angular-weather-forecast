import { Component, Input, OnInit } from '@angular/core';
import { WeatherBit } from '../models/weatherbit';

@Component({
  selector: 'app-daily-forecast',
  templateUrl: './daily-forecast.component.html',
  styleUrls: ['./daily-forecast.component.css']
})
export class DailyForecastComponent implements OnInit {

    @Input()
    forecast!: WeatherBit.Daily.Forecast;
        
    constructor() { }

    ngOnInit(): void {
    }

}
