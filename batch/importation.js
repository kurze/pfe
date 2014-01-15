#!/usr/bin/env node

var osmtogeojson = require('osmtogeojson'),
    DOMParser = require("xmldom").DOMParser;

process.stdin.resume();
process.stdin.setEncoding('utf8');

var XMLRaw="";

process.stdin.on('data', function (chunk) {
    XMLRaw += chunk;
});

process.stdin.on('end', function () {
        graph = processGraph(XMLRaw);
    });

function xmlToJson(xmlRaw){
    process.stdout.write('Converting XML to GeoJson\n');
    xml = (new DOMParser()).parseFromString(xmlRaw, 'text/xml');
    graph = osmtogeojson.toGeojson(xml);
    delete xml;
    delete xmlRaw;
    return graph;
}

function processGraph(graphXml){
    process.stdout.write('Start\n');
    graph = xmlToJson(graphXml);
    graph = takeOffPolygon(graph);
    graph = takeOffUselessLine(graph);
    return graph;
}

function takeOffPolygon(graph){
    process.stdout.write('Take off Polygon\n');
    for (var i= 0; i < graph.features.length; i++) {
        if(graph.features[i].geometry.type == "MultiPolygon" || graph.features[i].geometry.type == "Polygon"){
            graph.features[i] = null;
        }
    }
    return graph;
}

function takeOffUselessLine(graph){
    process.stdout.write('Take off useless lineString\n');
    for (var i= 0; i < graph.features.length; i++) {
        row = graph.features[i];
        if(row != null && row.geometry.type == "LineString"){
            if(row.properties != null && row.properties.highway != null){ // keep road, if usable by cyclist
                highway = row.properties.highway;
                if(highway != motorway &&
                   highway != trunk &&
                   highway != motorway_link &&
                   highway != trunk_link &&
                   highway != raceway &&
                   highway != steps){
                    continue;
                }
            } else if(row.properties != null && row.properties.cycleway != null){ // keep cycleway
                continue;
            }
            graph.features[i] = null;
        }
    }
    return graph;
}
