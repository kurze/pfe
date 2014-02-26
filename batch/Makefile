.PHONY: run launch init clean cleanDep 


#REGION = alsace aquitaine auvergne basse-normandie bourgogne bretagne centre champagne-ardenne corse franche-comte guadeloupe guyane haute-normandie ile-de-france languedoc limousin lorraine martinique mayotte midi-pyrenees nord-pas-de-calais pays-de-la-loire picardie poitou-charentes provence-alpes-cote-d-azur reunion rhone-alpes
REGION = mayotte guyane

URL_START="http://download.geofabrik.de/europe/france/"
URL_END="-latest.osm.pbf"

launch: init run

init: merge-geojsons.py node_modules

node_modules:
	npm install xmldom
	npm install osmtogeojson
	npm install lodash

merge-geojsons.py:
	git clone https://gist.github.com/3759608.git
	mv 3759608/merge-geojsons.py merge-geojsons.py
	rm -rf 3759608

clean:
	rm -rf out tmp

cleanDep: clean
	rm -rf node_modules merge-geojsons.py 3759608

run: $(REGION)

%: out/%.json

tmp/%.osm: tmp/%.osm.pbf
	@osmosis -q \
		--rbf tmp/$@.osm.pbf \
		--tf accept-ways highway=primary \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$@.highway-primary.osm \
		\
		--rbf tmp/$@.osm.pbf \
		--tf accept-ways highway=secondary \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$@.highway-secondary.osm \
		\
		--rbf tmp/$@.osm.pbf \
		--tf accept-ways highway=tertiary \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$@.highway-tertiary.osm \
		\
		--rbf tmp/$@.osm.pbf \
		--tf accept-ways highway=unclassified \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$@.highway-unclassified.osm \
		\
		--rbf tmp/$@.osm.pbf \
		--tf accept-ways highway=primary_link,secondary_link,tertiary_link \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$@.highway-link.osm \
		\
		--rbf tmp/$@.osm.pbf \
		--tf accept-ways highway=road \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$@.highway-road.osm \
		\
		--rbf tmp/$@.osm.pbf \
		--tf accept-ways highway=residential \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$@.highway-residential.osm \
		\
		--rbf tmp/$@.osm.pbf \
		--tf accept-ways highway=service \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$@.highway-service.osm \
		\
		--rbf tmp/$@.osm.pbf \
		--tf accept-ways highway=track \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$@.highway-track.osm \
		\
		--rbf tmp/$@.osm.pbf \
		--tf accept-ways highway="*" \
		--tf reject-ways highway=motorway,motorway_link,trunk,trunk_link,bridleway,steps,proposed,construction,raceway,primary,secondary,tertiary,unclassified,primary_link,secondary_link,tertiary_link,road,residential,service,track \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$@.highway-other.osm \
		\
		--rbf tmp/$@.osm.pbf \
		--tf accept-ways cycleway="*" \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$@.cycleway.osm

tmp/%.osm.pbf:
	NAME=`echo $@ | grep -Eo "[^/\.]{4,}" - `
	@curl $(URL_START)$(NAME)$(URL_END) > $@

tmp/%.json: tmp/%.osm
	osmtogeojson $+ >$@

out/%.json: tmp/%.highway-other.json tmp/%.highway-primary.json tmp/%.highway-residential.json tmp/%.highway-road.json tmp/%.highway-secondary.json tmp/%.highway-service.json tmp/%.highway-tertiary.json tmp/%.highway-track.json tmp/%.highway-unclassified.json tmp/%.highway-link.json tmp/%.cycleway.json 
	NAME=`echo $@ | grep -Eo "[^/\.]{4,}" - `
	python2 merge-geojsons.py tmp/$(NAME).*.json $@
