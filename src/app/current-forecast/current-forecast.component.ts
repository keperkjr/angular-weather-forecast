import { Component, Input, OnInit } from '@angular/core';
import { WeatherBit } from '../models/weatherbit';
import { Utils } from '../utils'

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

    getTimeOfDay() {
        return this.forecast.pod == 'd' ? 'Day' : 'Night';
    }
    getOutsideDescription() {
        return this.forecast.weather.description;
    }
    getLocalTime() {
        var date = Utils.convertTZ(new Date(), this.forecast.timezone);
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }
}
