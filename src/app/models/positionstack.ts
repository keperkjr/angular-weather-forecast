export namespace PositionStack {
    export interface Result {
        latitude: number;
        longitude: number;
        label: string;
        name: string;
        type: string;
        distance: number;
        number: string;
        street: string;
        postal_code: string;
        confidence: number;
        region: string;
        region_code: string;
        administrative_area?: any;
        neighbourhood: string;
        country: string;
        country_code: string;
        map_url: string;
    }

    export interface Data {
        results: Result[];
    }

    export interface Query {
        type: string;
        message: string;
    }

    export interface Context {
        query: Query[];
    }

    export interface Error {
        code: string;
        message: string;
        context: Context;
    }

    export interface Geocode {
        data: Data;
        error: Error;
    }
}