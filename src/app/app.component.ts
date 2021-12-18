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
        // this.getInitialLocation().then(() => {
        //     console.log('Initial location loaded')
        // }).catch((error) => {
        //     console.log(error);
        // });

        if (!this.locationApiAvailable) {
            // Call function prompting for gps
        }
    }

    async getInitialLocation() {
        let ipData = await this.getIPAddress();
        this.ipAddress = ipData.ip;
        let locationResults = await this.getLocation(LocationSearch.Type.IP, {ipAddress: this.ipAddress});
        this.locationApiAvailable = true;

        let info = locationResults.data[0];
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

    sortLocations(latitude: number, longitude: number, locationResults: PositionStack.Result) {
        locationResults.data.sort((a: any, b: any) => {
            let distanceA = Utils.getDistance(latitude, longitude, a.latitude, a.longitude);
            let distanceB = Utils.getDistance(latitude, longitude, b.latitude, b.longitude);                
            return distanceA - distanceB;
        })
    }

    async querySearch(searchQuery: string) {
        if (this.lastSearchData.searchQuery != searchQuery) {
            let locationResults = await this.getLocation(LocationSearch.Type.SearchQuery, {
                searchQuery: searchQuery
            });
            // Get the location that is the shortest distance from the user
            if (this.currentLocation != null) {
                this.sortLocations(this.currentLocation.latitude, this.currentLocation.longitude, locationResults);
            }
            this.selectedLocation = locationResults.data[0];
        }

        let longitude = this.selectedLocation.longitude;
        let latitude = this.selectedLocation.latitude;

        let forecast = await this.getForecast(latitude, longitude);
        this.currentWeather = forecast.currentWeather;   
    }

    async gpsSearch(latitude: number, longitude: number) {        
        if (this.lastSearchData.longitude != longitude || this.lastSearchData.latitude != latitude) {
            this.lastSearchData.searchQuery = '';

            let locationResults = await this.getLocation(LocationSearch.Type.GPS, {
                latitude, longitude
            });
            this.selectedLocation = locationResults.data[0];
        }

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
        let geocode!: PositionStack.Result;
        switch(type) {
            case LocationSearch.Type.IP:
                geocode = await firstValueFrom(this.positionStackApi.getReverseSearch(options.ipAddress || ''));
                break;
            case LocationSearch.Type.SearchQuery:
                geocode = await firstValueFrom(this.positionStackApi.getForwardSearch(options.searchQuery || ''));              
                break;
            case LocationSearch.Type.GPS:
                geocode = await firstValueFrom(this.positionStackApi.getReverseSearch(options.latitude || 0, options.longitude || 0));
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
        if (error instanceof RuntimeError.LocationError) {
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
                    await this.querySearch(eventData.searchQuery);
                    this.lastSearchData.searchQuery = eventData.searchQuery;
                    break;
                case LocationSearch.Type.GPS:
                    await this.gpsSearch(eventData.latitude, eventData.longitude);                
                    break;
                default:
                    throw new Error(`Unknown search type: ${type}`);
                    break;
            }

            this.lastSearchData.longitude = eventData.longitude;
            this.lastSearchData.latitude = eventData.latitude;
        } catch (error) {
            this.displayError(error);
        }
    }    
}