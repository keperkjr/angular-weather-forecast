import { Injectable } from '@angular/core';
import { PositionStack } from '../models/positionstack';
import { WeatherBit } from '../models/weatherbit';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

    initialLocation!: PositionStack.Location;
    currentLocation!: PositionStack.Location;
    currentForecast!: WeatherBit.Current.Forecast;
    currentDailyForecast!: WeatherBit.Daily.Forecast[];
        
    baseUrl!: string;
    lastSearchData = {
        searchQuery: '',
        longitude: 0,
        latitude: 0
    };
        
    constructor() { }
}
