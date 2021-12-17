import { LocationSearch } from './locationsearch';

export namespace RuntimeError {
    export class LocationError extends Error {
        code: LocationSearch.Type;
        constructor(msg: string, code: LocationSearch.Type) {
            super(msg);
            this.code = code;
    
            // Set the prototype explicitly.
            Object.setPrototypeOf(this, LocationError.prototype);
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