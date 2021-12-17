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
    searchQuery!: string;
    baseUrl: string;
    lastSearchData = {
        searchQuery: '',
        longitude: 0,
        latitude: 0
    };

    constructor(private positionStackApi: PositionStackApiService) { 
        this.baseUrl = location.href;
    }

    ngOnInit() {}

    async onClickSearchTest() {
        this.searchQuery = '92780';
        try {            
            if (this.geocodeForward == null || this.lastSearchData.searchQuery != this.searchQuery) {
                this.geocodeForward = await firstValueFrom(this.positionStackApi.ForwardSearch(this.searchQuery));
                console.log(this.geocodeForward);
            }
            if (this.geocodeForward.error != null) {
                throw new Error(this.geocodeForward.error.message);
            }            
            await this.delay(3000);

            await this.displayForecast(this.geocodeForward.data[0].longitude, this.geocodeForward.data[0].latitude);
            this.lastSearchData.searchQuery = this.searchQuery;             
        } catch (error) {
            console.log(error);
            alert(`Unable to display forecast. Please enter another search term and try again!`);
        }             
    }

    async onClickLocationTest() {
        let position = await Utils.getCurrentPosition();

        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        if (this.geocodeReverse == null || (this.lastSearchData.longitude != longitude || this.lastSearchData.latitude != latitude)) {
            this.geocodeReverse = await firstValueFrom(this.positionStackApi.ReverseSearch(latitude, longitude));
            console.log(this.geocodeReverse);
        }
    }

    async onClickIPAddressTest() {

    }    
    
    async displayForecast(latitude: number, longitude: number) {
        try {
            // Get forecase here
            this.lastSearchData.longitude = longitude;
            this.lastSearchData.latitude = latitude;            
        } catch (error) {
            console.log(error);
            alert(`Unable to display forecast. Please enter another search term and try again!`);
        }     
    } 

    delay(timeout: number) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }
}