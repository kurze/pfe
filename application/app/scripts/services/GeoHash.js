
// code base :
//   Copyright (c) 2011, Sun Ning.
//   https://github.com/sunng87/node-geohash.git
//   
//   http://git.yathit.com/ydn-base

'use strict';

/* jshint bitwise:false */

// constructor
var GeoHash = function() {

};

/// attache engine to the app as a service
angular.module('app').service('GeoHash', GeoHash);

/**
 * @const
 * @type {string}
 */
GeoHash.prototype.BASE32_CODES = '0123456789bcdefghjkmnpqrstuvwxyz';


/**
 * Encode coordinate into hash.
 * @param {Array.<number>} args an array representing [latitude,
 * longitude, opt_precision]
 * Latitude starts from -90 to 90.
 * Longitude starts from -180 to 180.
 * Precision is number of char to use for encoding. Default to 12 char. One char
 * encode 4 bits of latitude and longitude pair. The error is, thus,
 * 1 / Math.pow(2, 4 * precision/2) * 180. For default precision of 12 char,
 * the error is 0.0000107288 or 1.190 meter at equator.
 * @return {string}
 */
GeoHash.prototype.encode = function(args) {
	// NOTE: asm annotation for double and int.
	var lon = +args[0];
	var lat = +args[1];
	var numberOfChars = (args[2] || 9) | 0;
	var chars = [];

	var maxlat = 90;
	var minlat = -90;
	var maxlon = 180;
	var minlon = -180;

	var mid;
	var islon = true; // the first bit is longitude
	for (var i = 0; i < numberOfChars; i++) {
		var hashValue = 0;
		for (var bits = 0; bits < 5; bits++) {
			if (islon) {
				mid = (maxlon + minlon) / 2;
				if (lon > mid) {
					hashValue = (hashValue << 1) + 1;
					minlon = mid;
				} else {
					hashValue = (hashValue << 1) + 0;
					maxlon = mid;
				}
			} else {
				mid = (maxlat + minlat) / 2;
				if (lat > mid) {
					hashValue = (hashValue << 1) + 1;
					minlat = mid;
				} else {
					hashValue = (hashValue << 1) + 0;
					maxlat = mid;
				}
			}
			islon = !islon; // alternate longitude and longitude
		}

		chars[i] = this.BASE32_CODES[hashValue];
	}

	return chars.join('');
};


/**
 * Decode box hash.
 * @param {string} hashString geohash in lower case.
 * @return {Array.<number>} [minlat, minlon, maxlat, maxlon]
 * @private
 */
GeoHash.prototype.decodeBbox = function(hashString) {
	var islon = true;
	var maxlat = 90, minlat = -90;
	var maxlon = 180, minlon = -180;

	var hashValue = 0;
	for (var i = 0, l = hashString.length; i < l; i++) {
		var code = hashString.charAt(i);
		var mid;
		hashValue = this.BASE32_CODES.indexOf(code);

		for (var bits = 4; bits >= 0; bits--) {
			var bit = (hashValue >> bits) & 1;
			if (islon) {
				mid = (maxlon + minlon) / 2;
				if (bit === 1) {
					minlon = mid;
				} else {
					maxlon = mid;
				}
			} else {
				mid = (maxlat + minlat) / 2;
				if (bit === 1) {
					minlat = mid;
				} else {
					maxlat = mid;
				}
			}
			islon = !islon;
		}
	}
	return [+minlat, +minlon, +maxlat, +maxlon];
};


/**
 * Decode geo hash string into coordinate.
 * @param {string} hashString
 * @return {Array.<number>} [latitude, longitude: number,
 *   error_latitude, error_longitude]
 * }}
 */
GeoHash.prototype.decode = function(hashString) {
	var bbox = this.decodeBbox(hashString);
	var lat = (bbox[0] + bbox[2]) / 2;
	var lon = (bbox[1] + bbox[3]) / 2;
	var laterr = bbox[2] - lat;
	var lonerr = bbox[3] - lon;
	return [+lat, +lon, +laterr, +lonerr];
};


/**
 * Unit rectangular vector for relative direction representation.
 * @enum {Array}
 */
GeoHash.prototype.Direction = {
	NORTH: [1, 0],
	NORTH_EAST: [1, 1],
	NORTH_WEST: [1, -1],
	EAST: [0, 1],
	SOUTH: [-1, 0],
	SOUTH_EAST: [0, 1],
	SOUTH_WEST: [-1, -1],
	WEST: [0, -1]
};


/**
 * Return neighbor geohash of a given center position.
 * @param {string} hashstring
 * @param {this.Direction} direction Relative direction.
 * @return {string} neighbor geohash.
 */
GeoHash.prototype.neighbor = function(hashstring, direction) {
	var lonlat = this.decode(hashstring);
	var lat = lonlat[0];
	var lon = lonlat[1];
	var latErr = lonlat[2];
	var lonErr = lonlat[3];
	var neighborLat = lat + direction[0] * latErr * 2;
	var neighborLon = lon + direction[1] * lonErr * 2;
	return this.encode([neighborLat, neighborLon, hashstring.length]);
};


