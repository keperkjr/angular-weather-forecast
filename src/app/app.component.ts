import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PositionStack } from './models/positionstack';
import { WeatherBit } from './models/weatherbit';
import { PositionStackApiService, WeatherBitApiService } from './services/api.service';
import { Utils } from './utils';
import { LocationSearch } from './models/locationsearch';
import { RuntimeError } from './models/errors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../assets/css/divider.css']
})
export class AppComponent implements OnInit {
    title = 'My Programming Notes - Angular Weather Forecast';
    locationApiAvailable = false;
    weatherApiAvailable = true;

    locationResults!: PositionStack.Result;
    selectedLocation!: PositionStack.Location;
    currentLocation!: PositionStack.Location;
    currentWeather!: WeatherBit.Weather;
    futureWeather!: WeatherBit.Result;

    baseUrl: string;
    ipAddress = '';
    lastSearchData = {
        searchQuery: '',
        longitude: 0,
        latitude: 0
    };

    constructor(private http: HttpClient, private positionStackApi: PositionStackApiService, private weatherBitApi: WeatherBitApiService) { 
        this.baseUrl = location.href;
    }

    ngOnInit() {
        this.getInitialLocation().then(() => {
            console.log('Initial location loaded')
        }).catch((error) => {
            console.log(error);
        });

        if (!this.locationApiAvailable) {
            // Call function prompting for gps
        }
    }

    async getInitialLocation() {
        let ipData = await this.getIPAddress();
        this.ipAddress = ipData.ip;
        this.locationResults = await this.getLocation(LocationSearch.Type.IP, {ipAddress: this.ipAddress});
        this.locationApiAvailable = true;

        let info = this.locationResults.data[0];
        let longitude = info.longitude;
        let latitude = info.latitude;
        this.currentLocation = info;

        let forecast = await this.getForecast(latitude, longitude);
        this.currentWeather = forecast.currentWeather;

        this.weatherApiAvailable = true;
    }

    async getIPAddress(): Promise<any> {
        return firstValueFrom(this.http.get("http://api.ipify.org/?format=json"));
    }    

    async querySearch(searchQuery: string) {
        this.locationResults = await this.getLocation(LocationSearch.Type.SearchQuery, {
            searchQuery: searchQuery
        });

        // Get the location that is the shortest distance from the user
        if (this.currentLocation != null) {
            this.locationResults.data.sort((a, b) => {
                let distanceA = Utils.getDistance(this.currentLocation.latitude, this.currentLocation.longitude, a.latitude, a.longitude);
                let distanceB = Utils.getDistance(this.currentLocation.latitude, this.currentLocation.longitude, b.latitude, b.longitude);                
                return distanceA - distanceB;
            })
        }

        let info = this.locationResults.data[0];
        let longitude = info.longitude;
        let latitude = info.latitude;

        let forecast = await this.getForecast(latitude, longitude);
        this.currentWeather = forecast.currentWeather;            
    }

    async gpsSearch() {
        let position = await Utils.getCurrentPosition();
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        
        this.locationResults = await this.getLocation(LocationSearch.Type.GPS, {
            latitude, longitude
        });

        let forecast = await this.getForecast(latitude, longitude);
        this.currentWeather = forecast.currentWeather;  
    }
    
    async getForecast(latitude: number, longitude: number) {
        // Get forecase here
        let currentWeatherResults = await firstValueFrom(this.weatherBitApi.getCurrentWeather(latitude, longitude));
        console.log(currentWeatherResults);
        if (currentWeatherResults.count == 0 || currentWeatherResults.data.length == 0) {
            throw new RuntimeError.ForecastError(`No weather results returned for latitude: ${latitude}, longitude: ${longitude}`);
        }
        return {
            currentWeather: currentWeatherResults.data[0],
        };
    } 

    // TODO: Only do this if location api is available
    async getLocation(type: LocationSearch.Type, options: LocationSearch.Options) {
        let geocode = this.locationResults;
        switch(type) {
            case LocationSearch.Type.IP:
                geocode = await firstValueFrom(this.positionStackApi.getReverseSearch(options.ipAddress || ''));
                break;
            case LocationSearch.Type.SearchQuery:
                if (geocode == null || this.lastSearchData.searchQuery != options.searchQuery) {
                    geocode = await firstValueFrom(this.positionStackApi.getForwardSearch(options.searchQuery || ''));
                }                
                break;
            case LocationSearch.Type.GPS:
                if (geocode == null || (this.lastSearchData.longitude != options.longitude || this.lastSearchData.latitude != options.latitude)) {
                    geocode = await firstValueFrom(this.positionStackApi.getReverseSearch(options.latitude || 0, options.longitude || 0));
                }
                break;
            default:
                throw new Error(`Unknown search type: ${type}`);
                break;
        }
        console.log(geocode);
        if (geocode.error != null) {
            throw new RuntimeError.LocationError(geocode.error.message, type);
        } 
        return geocode;
    }

    displayError(error: any) {
        console.log(error);
        if (error instanceof GeolocationPositionError) {
            switch(error.code) {
                case GeolocationPositionError.PERMISSION_DENIED:
                    alert(`Unable to display forecast. Location access is denied. Please allow access and try again!`);
                    break;
                case GeolocationPositionError.POSITION_UNAVAILABLE:
                    alert(`Unable to display forecast. Location position is unavailable. Please allow access and try again!`);              
                    break;
                default:
                    alert(`Unable to display forecast. Location could not be detected. Please try again!`);
            }
        } else if (error instanceof RuntimeError.LocationError) {
            switch(error.code) {
                case LocationSearch.Type.IP:                    
                    break;
                case LocationSearch.Type.SearchQuery:
                    alert(`Unable to display forecast. Please enter another search term and try again!`);               
                    break;
                case LocationSearch.Type.GPS:
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
        let type = eventData.type;
        
        try {
            switch(type) {
                case LocationSearch.Type.SearchQuery:
                    this.querySearch(eventData.searchQuery);
                    break;
                case LocationSearch.Type.GPS:
                    await this.gpsSearch();                
                    break;
                default:
                    throw new Error(`Unknown search type: ${type}`);
                    break;
            }

            let info = this.locationResults.data[0];
            let longitude = info.longitude;
            let latitude = info.latitude;

            this.lastSearchData.longitude = longitude;
            this.lastSearchData.latitude = latitude;
            this.lastSearchData.searchQuery = eventData.searchQuery;
        } catch (error) {
            this.displayError(error);
        }
    }    
}