import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PositionStack } from './models/positionstack';
import { WeatherBit } from './models/weatherbit';
import { PositionStackApiService, WeatherBitApiService } from './services/api.service';
import { Utils } from './utils';

enum SearchType {
    IP,
    Query,
    GPS,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'My Programming Notes - Angular Weather Forecast';
    locationApiAvailable = false;

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
        this.getIPAddress().then((ipData: any) => {
            this.ipAddress = ipData.ip;
            this.getLocation(SearchType.IP).then((locationData) => {
                this.locationApiAvailable = true;
                this.location = locationData;

                let info = this.location.data[0];
                let longitude = info.longitude;
                let latitude = info.latitude;

                this.getForecast(longitude, latitude).then((forecastData) => {
                    this.currentWeather = forecastData;
                }).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    async getIPAddress() {
        return firstValueFrom(this.http.get("http://api.ipify.org/?format=json"));
    }    

    async onClickSearchTest() {
        this.searchQuery = '92780';
        try {            
            this.location = await this.getLocation(SearchType.Query);

            let info = this.location.data[0];
            let longitude = info.longitude;
            let latitude = info.latitude;

            await this.getForecast(longitude, latitude);

            this.lastSearchData.searchQuery = this.searchQuery;             
        } catch (error) {
            console.log(error);
            alert(`Unable to display forecast. Please enter another search term and try again!`);
        }             
    }

    async onClickLocationTest() {
        try {
            this.location = await this.getLocation(SearchType.GPS);

            let info = this.location.data[0];
            let longitude = info.longitude;
            let latitude = info.latitude;

            await this.getForecast(longitude, latitude);

            this.lastSearchData.longitude = longitude;
            this.lastSearchData.latitude = latitude;              
        } catch (error: any) {
            console.log(error);
            if (error instanceof GeolocationPositionError && error.code == GeolocationPositionError.PERMISSION_DENIED) {
                alert(`Unable to display forecast. Location access is denied. Please allow access and try again!`);
            } else {
                alert(`Unable to display forecast. Location could not be detected. Please try again!`);
            }
        }    
    }   
    
    async getForecast(latitude: number, longitude: number) {
        // Get forecase here
        let currentWeather = this.currentWeather;

        currentWeather = await firstValueFrom(this.weatherBitApi.getCurrentWeather(latitude, longitude));
        console.log(currentWeather);

        return currentWeather;
    } 

    async getLocation(type: SearchType) {
        let geocode = this.location;
        switch(type) {
            case SearchType.IP:
                geocode = await firstValueFrom(this.positionStackApi.getReverseSearch(this.ipAddress));
                break;
            case SearchType.Query:
                if (geocode == null || this.lastSearchData.searchQuery != this.searchQuery) {
                    geocode = await firstValueFrom(this.positionStackApi.getForwardSearch(this.searchQuery));
                }                
                break;
            case SearchType.GPS:
                let position = await Utils.getCurrentPosition();
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                if (geocode == null || (this.lastSearchData.longitude != longitude || this.lastSearchData.latitude != latitude)) {
                    geocode = await firstValueFrom(this.positionStackApi.getReverseSearch(latitude, longitude));
                }
                break;
            default:
                throw new Error(`Unknown search type: ${type}`);
                break;
        }
        console.log(geocode);
        if (geocode.error != null) {
            throw new Error(geocode.error.message);
        } 
        return geocode;        
    }
}