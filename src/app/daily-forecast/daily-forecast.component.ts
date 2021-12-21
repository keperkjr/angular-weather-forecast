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

    getForcastDateString() {
        let date = new Date(this.forecast.valid_date);
        date.setHours(23);
        return date.toLocaleString('en-US', {
            month: 'short',
            day  : '2-digit',
            weekday: "short",
            timeZone: 'UTC',
        });       
    }

    getForcastImgSrc() {
        return WeatherBit.getForcastImgSrc(this.forecast.weather.icon);
    }
    
    getUVIndexDescription() {
        return WeatherBit.getUVIndexDescription(this.forecast.uv);
    }

    getUVIndexCss() {
        let desc = this.getUVIndexDescription();
        let className = desc.replace(' ', '-').toLowerCase();
        return `uv-index ${className}`;
    }     
}
