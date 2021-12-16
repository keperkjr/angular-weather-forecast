import { Component, OnInit } from '@angular/core';
import { GeocodeLookup } from './models/geocodeLookup';
import { GeocodeParse } from './models/geocodeParse';
import { GeocodeApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'My Programming Notes - Angular Weather Forecast';
    geocodeLookup!: GeocodeLookup.Result;
    geocodeParse!: GeocodeParse.Result;
    baseUrl: string;

    constructor(private geocodeApi: GeocodeApiService) { 
        this.baseUrl = location.href;
    }

    ngOnInit() {
        var search = 'los angeles california usa';
        var errorOccurred = false;
        this.geocodeApi.lookup(search).subscribe({
            next: (data) => {
                console.log(data); 
                if (data.error != null) {
                    errorOccurred = true;
                }        
            },
            error: (error) => {
                console.log(error);
                errorOccurred = true;
            },
        }).add(() => {
            if (errorOccurred) {
                alert(`Unable to determine location. Please enter another search term and try again!`);
            }
        });         
    }    
}
