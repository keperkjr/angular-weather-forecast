// ============================================================================
//    Author: Kenneth Perkins
//    Date:   Dec 15, 2021
//    Taken From: http://programmingnotes.org/
//    File:  Utils.js
//    Description: Javascript that handles general utility functions
// ============================================================================
/**
* NAMESPACE: Utils
* USE: Handles general utility functions.
*/
var Utils = Utils || {};
(function(namespace) {
    'use strict';

    // Property to hold public variables and functions
    let exposed = namespace;

    /**
    * FUNCTION: getCurrentPosition
    * USE: Gets the current position of the device
    * @param options: The PositionOptions
    * @return: A promise that will contain the GeolocationPosition of the device on completion
    */
    exposed.getCurrentPosition = (options = null) => {
        return new Promise((resolve, reject) => {
            if (navigator && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject, options);
            } else {
                reject(new Error('Geolocation is not supported by this environment'));
            }
        });
    }  
    
    (function (factory) {
        if (typeof define === 'function' && define.amd) {
            define([], factory);
        } else if (typeof exports === 'object') {
            module.exports = factory();
        }
    }(function() { return namespace; }));      
}(Utils)); // http://programmingnotes.org/