import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
export class PositionStackApiService extends ApiService {
    baseUrl = 'http://api.positionstack.com/v1';
    key = '4e1d9e890cc83764371967a10d4f7be9';

    ForwardSearch(search: string) {
        let url = `${this.baseUrl}/forward?access_key=${this.key}&query=${encodeURIComponent(search)}&limit=1`; 
        console.log(url);
        return this.http.get<PositionStack.Result>(url);           
    }

    ReverseSearch(ipAddress: string): any;
    ReverseSearch(latitude: number, longitude: number): any;   
    ReverseSearch(param1: string | number, param2?: string | number): any {
        let search = '';
        if (param2 == null) {
            search = `${param1}`;
        } else {
            search = `${param1},${param2}`;
        }
        let url = `${this.baseUrl}/reverse?access_key=${this.key}&query=${search}&limit=1`; 
        console.log(url);
        return this.http.get<PositionStack.Result>(url);           
    }      
}