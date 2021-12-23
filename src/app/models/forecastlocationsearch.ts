// ============================================================================
//    Author: Kenneth Perkins
//    Date:   Dec 22, 2021
//    Taken From: http://programmingnotes.org/
//    File:  forecastlocationsearch.ts
//    Description: Custom location search models
// ============================================================================
export namespace ForecastLocationSearch {
    export enum Type {
        IP,
        SearchQuery,
        GPS,
    }
    
    export interface Options {
        ipAddress?: string;
        searchQuery?: string;
        latitude?: number;
        longitude?: number;
    }
}