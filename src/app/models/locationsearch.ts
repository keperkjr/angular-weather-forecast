export namespace LocationSearch {
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
