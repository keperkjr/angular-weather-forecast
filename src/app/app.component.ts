import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { GeocodeLookup } from './models/geocodeLookup';
import { GeocodeLocation } from './models/geocodeLocation';
import { GeocodeApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'My Programming Notes - Angular Weather Forecast';
    geocodeLookup!: GeocodeLookup.Result;
    geocodeLocation!: GeocodeLocation.Result;
    searchQuery!: string;
    baseUrl: string;
    lastSearchData = {
        searchQuery: '',
        longitude: 0,
        latitude: 0
    };

    constructor(private geocodeApi: GeocodeApiService) { 
        this.baseUrl = location.href;
    }

    ngOnInit() {}

    async onClickTest() {
        this.searchQuery = '92780';
        try {            

            let coords = await this.getSearchCoordinates(this.searchQuery);
            await this.delay(3000);

            await this.displayForecast(coords.longitude, coords.latitude);
            this.lastSearchData.searchQuery = this.searchQuery;             
        } catch (error) {
            console.log(error);
            alert(`Unable to display forecast. Please enter another search term and try again!`);
        }             
    }

    async getSearchCoordinates(searchQuery: string) {
        this.geocodeLookup = await this.maybeGetGeocodeLookup(searchQuery);
        if (this.geocodeLookup.error != null) {
            throw new Error(this.geocodeLookup.error.description);
        }

        let longitude = 0;
        let latitude = 0;
        if (this.geocodeLookup.longt != null && this.geocodeLookup.latt != null) {
            longitude = Number(this.geocodeLookup.longt);
            latitude = Number(this.geocodeLookup.latt);
        } else if (this.geocodeLookup.alt != null && this.geocodeLookup.alt.loc != null && this.geocodeLookup.alt.loc.length > 0) {
            let loc = this.geocodeLookup.alt.loc[0];
            if (loc.longt != null && loc.latt != null) {
                longitude = Number(loc.longt);
                latitude = Number(loc.latt);
            }
        } else {
            throw new Error(`Unable to determine lookup location from search: ${this.searchQuery}`);
        }
        return {
            longitude,
            latitude,
        };      
    }
    
    async displayForecast(longitude: number, latitude: number) {
        try {
            let location = await this.maybeGetGeocodeLocation(longitude, latitude);

            // Get forecase here
            this.lastSearchData.longitude = longitude;
            this.lastSearchData.latitude = latitude; 
            this.geocodeLocation = location;               
        } catch (error) {
            console.log(error);
            alert(`Unable to display forecast. Please enter another search term and try again!`);
        }     
    } 
    

    async maybeGetGeocodeLocation(longitude: number, latitude: number) {
        if (this.lastSearchData.longitude == longitude && this.lastSearchData.latitude == latitude) {
            return this.geocodeLocation;
        }
        let newLocation = await firstValueFrom(this.geocodeApi.getLocation(longitude, latitude));
        console.log(newLocation);
        return newLocation;
    }

    async maybeGetGeocodeLookup(searchQuery: string) {
        if (this.geocodeLookup != null && this.lastSearchData.searchQuery == searchQuery) {
            return this.geocodeLookup;
        }
        let newLookup = await firstValueFrom(this.geocodeApi.lookup(searchQuery));
        console.log(newLookup);
        return newLookup;
    }

    delay(timeout: number) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }
}
