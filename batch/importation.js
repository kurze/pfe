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
        processGraph(XMLRaw);
    });

function xmlToJson(xmlRaw){
    console.error('Converting XML to GeoJson');
    xml = (new DOMParser()).parseFromString(xmlRaw, 'text/xml');
    graph = osmtogeojson.toGeojson(xml);
    delete xml;
    delete xmlRaw;
    return graph;
}

function processGraph(graphXml){
    console.error('Start');
    graph = xmlToJson(graphXml);
    graph = takeOffPolygon(graph);
    graph = takeOffUselessLine(graph);
    graph = removeNull(graph);
    exportGraph(graph);
}

function takeOffPolygon(graph){
    console.error('Take off Polygon');
    for (var i= 0; i < graph.features.length; i++) {
        if(graph.features[i].geometry.type == "MultiPolygon" || graph.features[i].geometry.type == "Polygon"){
            delete graph.features[i];
        }
    }
    return graph;
}

function takeOffUselessLine(graph){
    console.error('Take off useless lineString');
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
            delete graph.features[i];
        }
    }
    return graph;
}

function removeNull(graph){
    console.error('Remove Null row');
    newGraph = [];
    for (var i= 0; i < graph.features.length; i++) {
        if(graph.features[i] != null){
            newGraph.push(graph.features[i]);
        }
    }
    return newGraph;
}

function exportGraph(graph){
    console.error('Export graph in GEOJson');
    graphJson = JSON.stringify(graph);
    delete graph;
    process.stdout.write(graphJson);
}
