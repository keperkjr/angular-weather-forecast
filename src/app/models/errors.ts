// ============================================================================
//    Author: Kenneth Perkins
//    Date:   Dec 22, 2021
//    Taken From: http://programmingnotes.org/
//    File:  errors.ts
//    Description: Custom errors classes
// ============================================================================
import { ForecastLocationSearch } from './forecastlocationsearch';

export namespace RuntimeError {
    export class ForecastLocationError extends Error {
        code: ForecastLocationSearch.Type;
        constructor(msg: string, code: ForecastLocationSearch.Type) {
            super(msg);
            this.code = code;
    
            // Set the prototype explicitly.
            Object.setPrototypeOf(this, ForecastLocationError.prototype);
        }
    }
    export class ForecastError extends Error {
        constructor(msg: string) {
            super(msg);
    
            // Set the prototype explicitly.
            Object.setPrototypeOf(this, ForecastError.prototype);
        }
    }    
}