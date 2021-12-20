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

    localDate!: string;
    
    constructor() { }

    ngOnInit(): void {
        this.localDate = this.getLocalDateString();
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

    getLocalDateString() {
        let date = this.toLocalDatetime(new Date());
        return `${Utils.getWeekdayName(date)} ${Utils.getDateTimeString(date)}`;
    }

    getLocalSunrise() {
        let split = this.forecast.sunrise.split(':');
        let date = new Date();
        date.setHours(Number(split[0]));
        date.setMinutes(Number(split[1]));
        return Utils.getTimeString(this.toLocalDatetime(Utils.treatAsUTC(date)));
    }

    getLocalSunset() {
        let split = this.forecast.sunset.split(':');
        let date = new Date();
        date.setHours(Number(split[0]));
        date.setMinutes(Number(split[1]));        
        return Utils.getTimeString(this.toLocalDatetime(Utils.treatAsUTC(date)));
    }

    getLastUpdated() {
        let date = new Date(this.forecast.ob_time);
        return Utils.getTimeString(Utils.treatAsUTC(date));
    }

    toLocalDatetime(date: Date) {
        return Utils.convertTimezone(date, this.forecast.timezone);
    }
}
