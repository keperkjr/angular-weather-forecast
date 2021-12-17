export namespace PositionStack {
    export interface Result {
        data: Data[]
        error: Error
      }
      
      export interface Data {
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