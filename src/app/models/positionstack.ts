// ============================================================================
//    Author: Kenneth Perkins
//    Date:   Dec 22, 2021
//    Taken From: http://programmingnotes.org/
//    File:  positionstack.ts
//    Description: Models for the PositionStack Api
// ============================================================================
export namespace PositionStack {
    export interface Result {
        data: Location[]
        error: Error
      }
      
      export interface Location {
        latitude: number
        longitude: number
        type: string
        name: string
        number: any
        postal_code: string
        street: any
        confidence: number
        region: string
        region_code: string
        county: string
        locality: string
        administrative_area: any
        neighbourhood: any
        country: string
        country_code: string
        continent: string
        label: string
      }
      
      export interface Error {
        code: string
        message: string
      } 
}