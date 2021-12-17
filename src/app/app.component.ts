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
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'My Programming Notes - Angular Weather Forecast';
    locationApiAvailable = false;
    weatherApiAvailable = true;

    location!: PositionStack.Result;
    currentWeather!: WeatherBit.Result;
    futureWeather!: WeatherBit.Result;

    searchQuery!: string;
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
        // this.getIPAddress().then((ipData: any) => {
        //     this.ipAddress = ipData.ip;
        //     this.getLocation(LocationSearch.Type.IP, {ipAddress: this.ipAddress}).then((locationData) => {
        //         this.locationApiAvailable = true;
        //         this.location = locationData;

        //         let info = this.location.data[0];
        //         let longitude = info.longitude;
        //         let latitude = info.latitude;

        //         this.getForecast(latitude, longitude).then((forecastData) => {
        //             this.currentWeather = forecastData;
        //             this.weatherApiAvailable = true;
        //         }).catch((error) => {
        //             console.log(error);
        //         });
        //     }).catch((error) => {
        //         console.log(error);
        //     });
        // }).catch((error) => {
        //     console.log(error);
        // });

        if (!this.locationApiAvailable) {
            // Call function prompting for gps
        }
    }

    async getIPAddress() {
        return firstValueFrom(this.http.get("http://api.ipify.org/?format=json"));
    }    

    async onClickSearchTest() {
        this.searchQuery = '92780';
        try {            
            this.location = await this.getLocation(LocationSearch.Type.SearchQuery, {
                searchQuery: this.searchQuery
            });

            let info = this.location.data[0];
            let longitude = info.longitude;
            let latitude = info.latitude;

            this.currentWeather = await this.getForecast(latitude, longitude);

            this.lastSearchData.searchQuery = this.searchQuery;             
        } catch (error) {
            this.displayError(error);
        }             
    }

    async onClickLocationTest() {
        try {
            let position = await Utils.getCurrentPosition();
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            
            this.location = await this.getLocation(LocationSearch.Type.GPS, {
                latitude, longitude
            });

            this.currentWeather = await this.getForecast(latitude, longitude);

            this.lastSearchData.longitude = longitude;
            this.lastSearchData.latitude = latitude;              
        } catch (error) {
            this.displayError(error);
        }    
    }
    
    async getForecast(latitude: number, longitude: number) {
        // Get forecase here
        let currentWeather = await firstValueFrom(this.weatherBitApi.getCurrentWeather(latitude, longitude));
        console.log(currentWeather);
        if (currentWeather.count == 0 || currentWeather.data.length == 0) {
            throw new RuntimeError.ForecastError(`No weather results returned for latitude: ${latitude}, longitude: ${longitude}`);
        }
        return currentWeather;
    } 

    // TODO: Only do this if location api is available
    async getLocation(type: LocationSearch.Type, options: LocationSearch.Options) {
        let geocode = this.location;
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
}