import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeocodeLookup } from '../models/geocodeLookup';
import { GeocodeParse } from '../models/geocodeParse';


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

    lookup(searchQuery: string) {     
        return this.http.get<GeocodeLookup.Result>(`${this.baseUrl}/${searchQuery}?json=1`);           
    }

    parse(longitude: number, latitude: number) {     
        return this.http.get<GeocodeParse.Result>(`${this.baseUrl}/${latitude},${longitude}?json=1`);           
    }    
}