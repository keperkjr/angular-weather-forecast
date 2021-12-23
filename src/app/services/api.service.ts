// ============================================================================
//    Author: Kenneth Perkins
//    Date:   Dec 22, 2021
//    Taken From: http://programmingnotes.org/
//    File:  api.service.ts
//    Description: Services that allow Api interaction
// ============================================================================
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PositionStack } from '../models/positionstack';
import { WeatherBit } from '../models/weatherbit';

@Injectable({
  providedIn: 'root'
})
export class ApiService {    
    constructor(protected http: HttpClient) { }       
}

@Injectable({
    providedIn: 'root'
})
export class WeatherBitApiService extends ApiService {
    baseUrl = 'https://api.weatherbit.io/v2.0';
    key = 'cb5f7550ce814ad6b74f515651f72b79';

    getCurrentForecast(latitude: number, longitude: number) {
        let url = `${this.baseUrl}/current?key=${this.key}&lat=${latitude}&lon=${longitude}&units=I`; 
        // console.log(url);
        return this.http.get<WeatherBit.Current.Result>(url);           
    }  
    getDailyForecast(latitude: number, longitude: number) {
        let url = `${this.baseUrl}/forecast/daily?key=${this.key}&lat=${latitude}&lon=${longitude}&units=I`;         
        // console.log(url);
        return this.http.get<WeatherBit.Daily.Result>(url);           
    }          
}

@Injectable({
    providedIn: 'root'
})
export class PositionStackApiService extends ApiService {
    baseUrl = 'http://api.positionstack.com/v1';
    key = '4e1d9e890cc83764371967a10d4f7be9';

    getForwardSearch(search: string) {
        //&limit=1
        let url = `${this.baseUrl}/forward?access_key=${this.key}&query=${encodeURIComponent(search)}`; 
        // console.log(url);
        return this.http.get<PositionStack.Result>(url);           
    }

    getReverseSearch(ipAddress: string): any;
    getReverseSearch(latitude: number, longitude: number): any;   
    getReverseSearch(param1: string | number, param2?: string | number): any {
        let search = '';
        if (param2 == null) {
            search = `${param1}`;
        } else {
            search = `${param1},${param2}`;
        }
        let url = `${this.baseUrl}/reverse?access_key=${this.key}&query=${search}&limit=1`; 
        // console.log(url);
        return this.http.get<PositionStack.Result>(url);           
    }      
}