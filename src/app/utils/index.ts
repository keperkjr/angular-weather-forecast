export namespace Utils {
    /**
    * FUNCTION: getCurrentPosition
    * USE: Gets the current position of the device
    * @param options: The PositionOptions
    * @return: A promise that will contain the GeolocationPosition of the device on completion
    */
    export async function getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition> {
        return new Promise((resolve, reject) => {
            if (navigator && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject, options);
            } else {
                reject(new Error('Geolocation is not supported by this environment'));
            }
        });         
    }
}