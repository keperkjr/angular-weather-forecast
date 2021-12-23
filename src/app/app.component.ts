// ============================================================================
//    Author: Kenneth Perkins
//    Date:   Dec 22, 2021
//    Taken From: http://programmingnotes.org/
//    File:  app.component.ts
//    Description: App typescript
// ============================================================================
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { PositionStack } from './models/positionstack';
import { WeatherBit } from './models/weatherbit';
import { PositionStackApiService, WeatherBitApiService } from './services/api.service';
import { Utils } from './utils';
import { ForecastLocationSearch } from './models/forecastlocationsearch';
import { RuntimeError } from './models/errors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'My Programming Notes - Angular Weather Forecast';
    locationApiAvailable = true;

    debug = true;

    isLoading = false;
    initialLocation!: PositionStack.Location;
    currentLocation!: PositionStack.Location;
    currentForecast!: WeatherBit.Current.Forecast;
    currentDailyForecast!: WeatherBit.Daily.Forecast[];

    baseUrl: string;
    lastSearchData = {
        searchQuery: '',
        longitude: 0,
        latitude: 0
    };
          
    constructor(private http: HttpClient, private positionStackApi: PositionStackApiService, private weatherBitApi: WeatherBitApiService) { 
        this.baseUrl = location.href;
    }

    ngOnInit() {
        if (!this.debug) {
            this.isLoading = true;
            this.loadInitialForecast().then(() => {
                console.log('Initial forecast loaded');
                this.isLoading = false;
            }).catch((error) => {
                console.log(error); 
                this.isLoading = false;              
            });
        } else {
            this.locationApiAvailable = true;
        }

        if (this.positionStackApi.key.length == 0) {
            alert('A https://positionstack.com/ API Key is not defined. Please register an account to obtain your own api key (free), and then set it within the PositionStackApiService class in the app/services folder');
        } 
        if (this.weatherBitApi.key.length == 0) {
            alert('A https://www.weatherbit.io/ API Key is not defined. Please register an account to obtain your own api key (free), and then set it within the WeatherBitApiService class in the app/services folder');
        }
    }

    async loadInitialForecast() {
        try {
            await this.ipAddressSearch();
        } catch (error) {
            if (error instanceof RuntimeError.ForecastLocationError) {
                this.locationApiAvailable = false;
            }
            try {
                console.log('Location api is unavailable, getting forecast from gps position', error);
                let position = await Utils.getCurrentPosition();
                await this.gpsSearch(position.coords.latitude, position.coords.longitude);             
            } catch(error2) {
                Utils.displayError(error2);             
            }
        }
    }

    async ipAddressSearch() {
        let ipData = await this.getIPAddress();
        let locationResults = await this.getForecastLocation(ForecastLocationSearch.Type.IP, {
            ipAddress: ipData.ip
        });

        this.initialLocation = locationResults.data[0];
        let longitude = this.initialLocation.longitude;
        let latitude = this.initialLocation.latitude;

        let forecast = await this.getForecast(latitude, longitude);

        this.currentForecast = forecast.current;
        this.currentDailyForecast = forecast.daily
        this.currentLocation = this.initialLocation;
    }

    async getIPAddress(): Promise<any> {
        return firstValueFrom(this.http.get("http://api.ipify.org/?format=json"));
    }    
      
    async querySearch(searchQuery: string) {
        let searchLocation = this.currentLocation;
        if (this.locationApiAvailable && 
            (this.currentLocation == null || this.lastSearchData.searchQuery != searchQuery)) {
            let locationResults = await this.getForecastLocation(ForecastLocationSearch.Type.SearchQuery, {
                searchQuery: searchQuery
            });
            searchLocation = locationResults.data[0];

            // Get the location that is the shortest distance from the user
            if (this.initialLocation != null) {
                searchLocation = PositionStack.getNearestLocation(this.initialLocation.latitude, this.initialLocation.longitude, locationResults);
            }
        }

        let longitude = searchLocation.longitude;
        let latitude = searchLocation.latitude;

        let forecast = await this.getForecast(latitude, longitude);

        this.currentForecast = forecast.current;  
        this.currentDailyForecast = forecast.daily; 
        this.currentLocation = searchLocation;

        this.lastSearchData.longitude = longitude;
        this.lastSearchData.latitude = latitude;
        this.lastSearchData.searchQuery = searchQuery;        
    }

    async gpsSearch(latitude: number, longitude: number) {   
        let searchLocation = this.currentLocation;     
        if (this.locationApiAvailable && 
            (this.currentLocation == null || this.lastSearchData.longitude != longitude || this.lastSearchData.latitude != latitude)) {
            this.lastSearchData.searchQuery = '';

            let locationResults = await this.getForecastLocation(ForecastLocationSearch.Type.GPS, {
                latitude, longitude
            });
            searchLocation = locationResults.data[0];
        }

        let forecast = await this.getForecast(latitude, longitude);

        this.currentForecast = forecast.current;
        this.currentDailyForecast = forecast.daily; 
        this.currentLocation = searchLocation;

        this.lastSearchData.longitude = longitude;
        this.lastSearchData.latitude = latitude;        
    }
    
    async getForecast(latitude: number, longitude: number) {
        // Get current forecast
        let current = await firstValueFrom(this.weatherBitApi.getCurrentForecast(latitude, longitude));
        console.log(current);
        if (current.count == 0 || current.data.length == 0) {
            throw new RuntimeError.ForecastError(`No current forecast results returned for latitude: ${latitude}, longitude: ${longitude}`);
        }

        // Get daily forecast
        let daily = await firstValueFrom(this.weatherBitApi.getDailyForecast(latitude, longitude));

        return {
            current: current.data[0],
            daily: daily.data
        };
    } 

    async getForecastLocation(type: ForecastLocationSearch.Type, options: ForecastLocationSearch.Options) {
        let observable!: Observable<PositionStack.Result>;
        switch(type) {
            case ForecastLocationSearch.Type.IP:
                observable = this.positionStackApi.getReverseSearch(options.ipAddress || '');
                break;
            case ForecastLocationSearch.Type.SearchQuery:
                observable = this.positionStackApi.getForwardSearch(options.searchQuery || '');              
                break;
            case ForecastLocationSearch.Type.GPS:
                observable = this.positionStackApi.getReverseSearch(options.latitude || 0, options.longitude || 0);
                break;
            default:
                throw new Error(`Unknown search type: ${type}`);
                break;
        }
        let geocode = await firstValueFrom(observable);
        console.log(geocode);
        if (geocode.error != null) {
            throw new RuntimeError.ForecastLocationError(geocode.error.message, type);
        }  else if (!geocode.data || geocode.data.length == 0) {
            throw new RuntimeError.ForecastLocationError('No forecast location results returned', type);
        }
        return geocode;
    }

    async onSearchLocation(eventData: any) {
        console.log(eventData);
        this.isLoading = true;
        let type = eventData.type;
        try {
            switch(type) {
                case ForecastLocationSearch.Type.SearchQuery:
                    await this.querySearch(eventData.searchQuery);
                    break;
                case ForecastLocationSearch.Type.GPS:
                    await this.gpsSearch(eventData.latitude, eventData.longitude);                                    
                    break;
                default:
                    throw new Error(`Unknown search type: ${type}`);
                    break;
            }
            if (this.currentLocation != null) {
                console.log('Selected Location:', this.currentLocation);
            }
        } catch (error) {
            Utils.displayError(error);
        } finally {
            this.isLoading = false;
        }
    }    
}