import { Component, OnInit } from '@angular/core';
import { GeocodeLookup } from './models/geocodeLookup';
import { GeocodeParse } from './models/geocodeParse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'My Programming Notes - Angular Weather Forecast';
    geocodeLookup!: GeocodeLookup.Result;
    geocodeParse!: GeocodeParse.Result;
    
    constructor() { 
    }

    ngOnInit() {
    }    
}
