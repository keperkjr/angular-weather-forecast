import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeocodeLookup } from '../models/geocodeLookup';
import { GeocodeLocation } from '../models/geocodeLocation';

@Injectable({
  providedIn: 'root'
})
export class ApiService {    
    constructor(protected http: HttpClient) { }       
}

@Injectable({
    providedIn: 'root'
})
export class GeocodeApiService extends ApiService {
    baseUrl = 'https://geocode.xyz';

    lookup(search: string) {
        let url = `${this.baseUrl}/${encodeURIComponent(search)}?json=1`; 
        console.log(url);
        return this.http.get<GeocodeLookup.Result>(url);           
    }

    getLocation(longitude: number, latitude: number) {
        let url = `${this.baseUrl}/${latitude},${longitude}?json=1`; 
        console.log(url);   
        return this.http.get<GeocodeLocation.Result>(url);           
    }    
}