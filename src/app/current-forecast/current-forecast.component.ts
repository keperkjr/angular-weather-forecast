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
        return this.toLocalTime(new Date());
    }

    getLocalSunrise() {
        let split = this.forecast.sunrise.split(':');
        let date = new Date();
        date.setHours(Number(split[0]));
        date.setMinutes(Number(split[1]));
        return this.toLocalTime(Utils.treatAsUTC(date));
    }

    getLocalSunset() {
        let split = this.forecast.sunset.split(':');
        let date = new Date();
        date.setHours(Number(split[0]));
        date.setMinutes(Number(split[1]));        
        return this.toLocalTime(Utils.treatAsUTC(date));
    }

    getLastUpdated() {
        let date = new Date(this.forecast.ob_time);
        return this.toLocalTime(Utils.treatAsUTC(date));
    }

    toLocalTime(date: Date) {
        var date = Utils.convertTZ(date, this.forecast.timezone);
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }       
}
