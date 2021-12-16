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
    }    
}
