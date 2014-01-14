#!/usr/bin/env node

var osmtogeojson = require('osmtogeojson'),
    DOMParser = require("xmldom").DOMParser;

process.stdin.resume();
process.stdin.setEncoding('utf8');

var XMLRaw="";

process.stdout.write('Start\n');



process.stdin.on('data', function (chunk) {
    XMLRaw += chunk;
});

process.stdin.on('end', function () {
    process.stdout.write('End reading stdin\n');
    process.stdout.write('Start converting XML to GeoJson\n');

    xml = (new DOMParser()).parseFromString(XMLRaw, 'text/xml');
    jsonFull = osmtogeojson.toGeojson(xml);
    delete xml;

    process.stdout.write('End converting XML to GeoJson\n');

    process.stdout.write('0 size : ' + roughSizeOfObject(jsonFull) + '\n');

    process.stdout.write('Take off Polygon\n');
    for (var i= 0; i < jsonFull.features.length; i++) {
        if(jsonFull.features[i].geometry.type == "MultiPolygon" || jsonFull.features[i].geometry.type == "Polygon"){
            jsonFull.features[i] = null;
        }
    }
    process.stdout.write('1 size : ' + roughSizeOfObject(jsonFull) + '\n');

    process.stdout.write('Take off useless lineString\n');
    for (var i= 0; i < jsonFull.features.length; i++) {
        row = jsonFull.features[i];
        if(row != null && row.geometry.type == "LineString"){
            if(row.properties != null && row.properties.highway != null){
                highway = row.properties.highway;
                if(highway != motorway &&
                   highway != trunk &&
                   highway != motorway_link &&
                   highway != trunk_link &&
                   highway != raceway &&
                   highway != steps){
                    continue;
                }
            }
        }
        jsonFull.features[i] = null;
    }
    process.stdout.write('2 size : ' + roughSizeOfObject(jsonFull) + '\n');
});



function roughSizeOfObject( object ) {

    var objectList = [];

    var recurse = function( value )
    {
        var bytes = 0;

        if ( typeof value === 'boolean' ) {
            bytes = 4;
        }
        else if ( typeof value === 'string' ) {
            bytes = value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes = 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList[ objectList.length ] = value;

            for( i in value ) {
                bytes+= 8; // an assumed existence overhead
                bytes+= recurse( value[i] )
            }
        }

        return bytes;
    }

    return recurse( object );
}
