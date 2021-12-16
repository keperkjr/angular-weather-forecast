import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeocodeLookup } from '../models/geocodeLookup';
import { GeocodeLocation } from '../models/geocodeLocation';
import { PositionStack } from '../models/positionstack';
import { Observable } from 'rxjs';

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


@Injectable({
    providedIn: 'root'
})
export class PositionStackApiService extends ApiService {
    baseUrl = 'http://api.positionstack.com/v1';
    key = '4e1d9e890cc83764371967a10d4f7be9';

    ForwardSearch(search: string): Observable<PositionStack.Geocode> {
        let url = `${this.baseUrl}/forward?access_key=${this.key}&query=${encodeURIComponent(search)}&limit=1`; 
        console.log(url);
        return this.http.get<PositionStack.Geocode>(url);           
    }

    ReverseSearch(ipAddress: string): Observable<PositionStack.Geocode>;
    ReverseSearch(longitude: string, latitude: string): Observable<PositionStack.Geocode>;   
    ReverseSearch(param1: string, param2?: string): Observable<PositionStack.Geocode> {
        let search = '';
        if (param1 == null) {
            search = param1;
        } else {
            search = `${param2},${param1}`;
        }
        let url = `${this.baseUrl}/reverse?access_key=${this.key}&query=${search}&limit=1`; 
        console.log(url);
        return this.http.get<PositionStack.Geocode>(url);           
    }      
}