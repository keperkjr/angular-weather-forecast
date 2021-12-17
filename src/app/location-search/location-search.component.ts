import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocationSearch } from '../models/locationsearch';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.css']
})
export class LocationSearchComponent implements OnInit {
    searchQuery!: string;

    @Output('searchLocation')
    searchLocationEmitter = new EventEmitter();

    eventData = {
        searchQuery: '',
        type: -1,
    }
        
    constructor() { }

    ngOnInit(): void {
    }

    onSearchQueryLocation() {
        if (!this.searchQuery || this.searchQuery.trim().length == 0) {
            return;
        }
        this.eventData.searchQuery = this.searchQuery;
        this.eventData.type = LocationSearch.Type.SearchQuery;
        this.searchLocationEmitter.emit(this.eventData);
    }
    onSearcGPSLocation() {
        this.eventData.searchQuery = '';
        this.eventData.type = LocationSearch.Type.GPS;
        this.searchLocationEmitter.emit(this.eventData);
    }    
}
