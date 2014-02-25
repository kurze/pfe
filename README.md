# Offline html5 navigation app for cyclist

Application created during final project study @ Polytech Tours

## Application

Web application

### Use

####prerequisite

 * nodejs
 * npm

####install dependency

	make init

####run

	grunt serve

## Batch

script for importation of graph into GEOJson format

based on [osmosis](http://wiki.openstreetmap.org/wiki/Osmosis), [osmtogeojson](https://github.com/tyrasd/osmtogeojson) et [merge-geojsons](https://gist.github.com/migurski/3759608)

broken right now because doesn't support more than 60Mo of data.

### Use

####prerequisite (for now)

 * zsh
 * nodejs
 * npm
 * osmosis
 * curl

####install dependency

	make init

####run

	make

####clean dependency

	make cleanAll

####clean Data (temporary and final)

	make clean

## Server

add CORS (Cross-Origin ressource sharing) habilitation [enable-cors](http://enable-cors.org/index.html)

### Apache

add

     Header set Access-Control-Allow-Origin "*"

to virtualHost used to serve data

#### example

	<VirtualHost *:80>
		ServerAdmin example@example.org
		DocumentRoot "/srv/http/depot"
		ServerName depot.pfe.local
		ErrorLog "/home/kurze/Documents/pfe/log/error_log"
		CustomLog "/home/kurze/Documents/pfe/log/common_log" common
		Header set Access-Control-Allow-Origin "*"
	</VirtualHost>
