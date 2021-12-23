import { Injectable } from '@angular/core';
import { PositionStack } from '../models/positionstack';
import { WeatherBit } from '../models/weatherbit';

interface IObjectKeys {
    [key: string]: string | number | undefined;
}
  
interface SearchData extends IObjectKeys {
    searchQuery?: string;
    longitude?: number;
    latitude?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

    initialLocation!: PositionStack.Location;
    currentLocation!: PositionStack.Location;
    currentForecast!: WeatherBit.Current.Forecast;
    currentDailyForecast!: WeatherBit.Daily.Forecast[];
        
    baseUrl!: string;
    lastSearchData: SearchData = {
        searchQuery: '',
        longitude: 0,
        latitude: 0
    };
        
    constructor() { }

    setInitialLocation(data: any) {
        this.initialLocation = data;
    }

    setCurrentForecastData(data: any) {
        this.currentForecast = data.currentForecast;
        this.currentDailyForecast = data.currentDailyForecast;
        this.currentLocation = data.currentLocation;
    }

    setLastSearchData(data: SearchData) {
        for (let prop in data) {
            this.lastSearchData[prop] = data[prop];
        }
    }
}
