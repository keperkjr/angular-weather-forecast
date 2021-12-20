import { Component, Input, OnInit } from '@angular/core';
import { WeatherBit } from '../models/weatherbit';

@Component({
  selector: 'app-current-forecast',
  templateUrl: './current-forecast.component.html',
  styleUrls: ['./current-forecast.component.css']
})
export class CurrentForecastComponent implements OnInit {

    @Input()
    forecast!: WeatherBit.Weather;
    
    constructor() { }

    ngOnInit(): void {
    }

    getForcastImgSrc() {
        return `https://www.weatherbit.io/static/img/icons/${this.forecast.weather.icon}.png`
    }
}
