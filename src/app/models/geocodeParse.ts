export namespace GeocodeParse {
    export interface Result {
      statename: string
      distance: string
      elevation: string
      osmtags: Osmtags
      state: string
      latt: string
      city: string
      prov: string
      intersection: Intersection
      geocode: string
      geonumber: string
      country: string
      stnumber: string
      staddress: string
      inlatt: string
      alt: Alt
      timezone: string
      region: string
      postal: string
      poi: Poi
      longt: string
      remaining_credits: RemainingCredits
      confidence: string
      inlongt: string
      class: Class2
      adminareas: Adminareas
      altgeocode: string
      error: Error
    }

    export interface Osmtags {
      wikipedia: string
      source: string
      is_in_state_code: string
      tiger_PCICBSA: string
      tiger_PCINECTA: string
      place: string
      is_in_country_code: string
      tiger_LSAD: string
      tiger_FUNCSTAT: string
      boundary: string
      is_in_iso_3166_2: string
      tiger_PLCIDFP: string
      tiger_PLACENS: string
      tiger_NAME: string
      tiger_MTFCC: string
      tiger_CPI: string
      wikidata: string
      is_in_state: string
      is_in: string
      name: string
      tiger_PLACEFP: string
      is_in_country: string
      admin_level: string
      tiger_reviewed: string
      tiger_CLASSFP: string
      type: string
      tiger_STATEFP: string
      tiger_NAMELSAD: string
      border_type: string
    }

    export interface Intersection {
      distance: string
      xlat: string
      xlon: string
      street2: string
      street1: string
    }

    export interface Alt {
      loc: Loc
    }

    export interface Loc {
      staddress: string
      stnumber: string
      postal: string
      latt: string
      city: string
      prov: string
      longt: string
      class: Class
    }

    export interface Class {}

    export interface Poi {
      poilat: string
      name: string
      addr_street: string
      addr_postcode: string
      amenity: string
      poilon: string
      addr_city: string
      addr_housenumber: string
      building: string
      id: string
      poidist: string
    }

    export interface RemainingCredits {}

    export interface Class2 {}

    export interface Adminareas {
      admin6: Admin6
      admin8: Admin8
    }

    export interface Admin6 {
      wikipedia: string
      population: string
      county_abbrev: string
      county_ansi: string
      name_vi: string
      county_name_vi: string
      boundary: string
      wikidata: string
      attribution: string
      name: string
      nist_state_fips: string
      source_population: string
      admin_level: string
      nist_fips_code: string
      level: string
      alt_name: string
      county_name: string
      type: string
    }

    export interface Admin8 {
      wikipedia: string
      source: string
      is_in_state_code: string
      tiger_PCICBSA: string
      tiger_PCINECTA: string
      place: string
      is_in_country_code: string
      tiger_LSAD: string
      tiger_FUNCSTAT: string
      boundary: string
      is_in_iso_3166_2: string
      tiger_PLCIDFP: string
      tiger_PLACENS: string
      tiger_NAME: string
      tiger_MTFCC: string
      tiger_CPI: string
      wikidata: string
      is_in_state: string
      is_in: string
      name: string
      tiger_PLACEFP: string
      is_in_country: string
      admin_level: string
      level: string
      tiger_reviewed: string
      tiger_CLASSFP: string
      type: string
      tiger_STATEFP: string
      tiger_NAMELSAD: string
      border_type: string
    }

    export interface Error {
      description: string
      code: string
    }
}