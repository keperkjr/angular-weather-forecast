import { Injectable } from '@angular/core';
import { PositionStack } from '../models/positionstack';
import { WeatherBit } from '../models/weatherbit';

interface IObjectKeys {
    [key: string]: any | undefined;
}
  
interface SearchData {
    searchQuery?: string;
    longitude?: number;
    latitude?: number;
}

interface ForecastData {
    currentLocation: PositionStack.Location | any;
    currentForecast: WeatherBit.Current.Forecast | any;
    currentDailyForecast: WeatherBit.Daily.Forecast[];
}

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

    initialLocation!: PositionStack.Location;
        
    baseUrl!: string;
    lastSearchData: SearchData = {
        searchQuery: '',
        longitude: 0,
        latitude: 0
    };

    private forecastData: ForecastData = {
        currentLocation!: undefined,
        currentForecast!: undefined,
        currentDailyForecast: []
    };
        
    constructor() { }

    getCurrentLocation(): PositionStack.Location {
        return this.forecastData['currentLocation'];
    }

    getCurrentForecast(): WeatherBit.Current.Forecast {
        return this.forecastData['currentForecast'];
    }    

    getCurrentDailyForecast(): WeatherBit.Daily.Forecast[] {
        return this.forecastData['currentDailyForecast'];
    }       

    setInitialLocation(data: any) {
        this.initialLocation = data;
    }

    setCurrentForecastData(data: ForecastData) { 
        this.copyProps(data, this.forecastData);      
    }

    setLastSearchData(data: SearchData) {
        this.copyProps(data, this.lastSearchData);
    }

    copyProps(source: any, destination: any) {
        for (let prop in source) {
            destination[prop] = source[prop];
        }        
    }
}
