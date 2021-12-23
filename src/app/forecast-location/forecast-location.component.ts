// ============================================================================
//    Author: Kenneth Perkins
//    Date:   Dec 22, 2021
//    Taken From: http://programmingnotes.org/
//    File:  forecast-location.component.ts
//    Description: Forecast location typescript
// ============================================================================
import { Component, Input, OnInit } from '@angular/core';
import { PositionStack } from '../models/positionstack';

@Component({
  selector: 'app-forecast-location',
  templateUrl: './forecast-location.component.html',
  styleUrls: ['./forecast-location.component.css']
})
export class ForecastLocationComponent implements OnInit {

    @Input()
    location!: PositionStack.Location;
    
    constructor() { }

    ngOnInit(): void {
    }

    getCity() {
        return this.location.locality ? this.location.locality: this.location.county;
    }
}