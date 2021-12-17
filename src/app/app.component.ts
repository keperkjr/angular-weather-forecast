import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PositionStack } from './models/positionstack';
import { PositionStackApiService } from './services/api.service';
import { Utils } from './utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'My Programming Notes - Angular Weather Forecast';
    geocodeForward!: PositionStack.Result;
    geocodeReverse!: PositionStack.Result;
    geocodeDisplay!: PositionStack.Result;
    searchQuery!: string;
    baseUrl: string;
    ipAddress = '';
    lastSearchData = {
        searchQuery: '',
        longitude: 0,
        latitude: 0
    };

    constructor(private http: HttpClient, private positionStackApi: PositionStackApiService) { 
        this.baseUrl = location.href;
    }

    ngOnInit() {
        this.getIPAddress().then((data: any) => {
            this.ipAddress = data.ip;
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
            if (this.geocodeForward == null || this.lastSearchData.searchQuery != this.searchQuery) {
                this.geocodeForward = await firstValueFrom(this.positionStackApi.ForwardSearch(this.searchQuery));
                console.log(this.geocodeForward);
            }           
            await this.delay(3000);

            await this.displayForecast(this.geocodeForward);
            this.lastSearchData.searchQuery = this.searchQuery;             
        } catch (error) {
            console.log(error);
            alert(`Unable to display forecast. Please enter another search term and try again!`);
        }             
    }

    async onClickLocationTest() {
        try {
            let position = await Utils.getCurrentPosition();

            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            if (this.geocodeReverse == null || (this.lastSearchData.longitude != longitude || this.lastSearchData.latitude != latitude)) {
                this.geocodeReverse = await firstValueFrom(this.positionStackApi.ReverseSearch(latitude, longitude));
                console.log(this.geocodeReverse);
            }

            await this.displayForecast(this.geocodeReverse);

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

    async onClickIPAddressTest() {
        try {
            this.geocodeReverse = await firstValueFrom(this.positionStackApi.ReverseSearch(this.ipAddress));
            console.log(this.geocodeReverse);

            await this.displayForecast(this.geocodeReverse);
        } catch (error: any) {
            console.log(error);
            alert(`Unable to display forecast. Location from IP Address could not be detected. Please try again!`);
        } 
    }    
    
    async displayForecast(geocode: PositionStack.Result) {
        if (geocode.error != null) {
            throw new Error(geocode.error.message);
        }
        let info = geocode.data[0];

        let longitude = info.longitude;
        let latitude = info.latitude;
        let city = info.locality;
        let region = info.region;
        
        // Get forecase here 


        this.geocodeDisplay = geocode;
    } 

    delay(timeout: number) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }
}