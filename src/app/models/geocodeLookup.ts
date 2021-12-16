export namespace GeocodeLookup {
    export interface Result {
      standard: Standard
      longt: string
      alt: Alt
      elevation: Elevation
      latt: string
      error: Error
    }

    export interface Standard {
      addresst: string
      stnumber: string
      postal: string
      region: string
      zip: string
      city: string
      prov: string
      countryname: string
      confidence: string
    }

    export interface Alt {
      loc: Loc[]
    }

    export interface Loc {
      staddress: any
      stnumber: string
      postal: string
      region: string
      latt: string
      longt: string
      city: string
      prov: string
      countryname: string
    }

    export interface Elevation {}

    export interface Error {
      description: string
      code: string
    }
}