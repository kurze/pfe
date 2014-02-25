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

based of [osmtogeojson](https://github.com/tyrasd/osmtogeojson) and nodejs

broken right now because doesn't support more than 60Mo of data.

### Use

####prerequisite (for now)

 * zsh
 * nodejs
 * npm

####install dependency

	make init

####run

	./batch.zsh
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
