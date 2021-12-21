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
    dailyForecast!: WeatherBit.Daily.Result;

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
                this.displayError(error2);             
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
        this.dailyForecast = forecast.daily
        this.currentLocation = this.initialLocation;
    }

    async getIPAddress(): Promise<any> {
        return firstValueFrom(this.http.get("http://api.ipify.org/?format=json"));
    }    

    getNearestLocation(latitude: number, longitude: number, locationResults: PositionStack.Result) {
        let nearestDistance = Number.MAX_VALUE;
        let nearestLocation!: PositionStack.Location;
        for (let location of locationResults.data) {
            let distance = Utils.getDistance(latitude, longitude, location.latitude, location.longitude);
            if (distance < nearestDistance) {
                nearestLocation = location;
                nearestDistance = distance;
            }
        }
        return nearestLocation;
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
                searchLocation = this.getNearestLocation(this.initialLocation.latitude, this.initialLocation.longitude, locationResults);
            }
        }

        let longitude = searchLocation.longitude;
        let latitude = searchLocation.latitude;

        let forecast = await this.getForecast(latitude, longitude);

        this.currentForecast = forecast.current;  
        this.dailyForecast = forecast.daily; 
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
        this.dailyForecast = forecast.daily; 
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
        console.log(daily);
        if (daily.data.length == 0) {
            throw new RuntimeError.ForecastError(`No daily forecast results returned for latitude: ${latitude}, longitude: ${longitude}`);
        }

        return {
            current: current.data[0],
            daily: daily
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

    displayError(error: any) {
        console.log(error);
        if (error instanceof RuntimeError.ForecastLocationError) {
            switch(error.code) {
                case ForecastLocationSearch.Type.IP:                    
                    break;
                case ForecastLocationSearch.Type.SearchQuery:
                    alert(`Unable to display forecast. Location could not be determined from the entered search term. Please enter another search term and try again!`);               
                    break;
                case ForecastLocationSearch.Type.GPS:
                    alert(`Unable to display forecast. Location could not be detected from your current position. Please try again!`);
                    break;
                default:
                    alert(`Unable to display forecast. Location could not be detected. Please try again!`);
            }
        } else if (error instanceof RuntimeError.ForecastError) {
            alert(`There currently is no weather forecast information available for the selected location. Please try a different location!`);
        } else {
            alert(`Unable to display forecast. Please try again!`);
        }
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
            this.displayError(error);
        } finally {
            this.isLoading = false;
        }
    }    
}