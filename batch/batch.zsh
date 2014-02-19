#! /bin/zsh

printBold(){
	echo "\033[1m"$1 $2"\033[0m"
}

urlList=(
    "http://download.geofabrik.de/europe/france/alsace-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/aquitaine-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/auvergne-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/basse-normandie-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/bourgogne-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/bretagne-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/centre-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/champagne-ardenne-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/corse-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/franche-comte-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/guadeloupe-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/guyane-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/haute-normandie-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/ile-de-france-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/languedoc-roussillon-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/limousin-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/lorraine-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/martinique-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/mayotte-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/midi-pyrenees-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/nord-pas-de-calais-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/pays-de-la-loire-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/picardie-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/poitou-charentes-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/provence-alpes-cote-d-azur-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/reunion-latest.osm.bz2"
    "http://download.geofabrik.de/europe/france/rhone-alpes-latest.osm.bz2"
)
nameList=(
    "alsace"
    "aquitaine"
    "auvergne"
    "basse-normandie"
    "bourgogne"
    "bretagne"
    "centre"
    "champagne-ardenne"
    "corse"
    "franche-comte"
    "guadeloupe"
    "guyane"
    "haute-normandie"
    "ile-de-france"
    "languedoc"
    "limousin"
    "lorraine"
    "martinique"
    "mayotte"
    "midi-pyrenees"
    "nord-pas-de-calais"
    "pays-de-la-loire"
    "picardie"
    "poitou-charentes"
    "provence-alpes-cote-d-azur"
    "reunion"
    "rhone-alpes"
)

mkdir out
mkdir tmp

for ((i=1; $i <= $#urlList; i++)) do

	##echo "\033[1m#" $nameList[$i] "\033[0m"
	printBold "#" $nameList[$i]

	printBold "## download and inflate"
	curl $urlList[$i] > tmp/$nameList[$i].osm.bz2 
	cat tmp/$nameList[$i].osm.bz2 | bzcat > tmp/$nameList[$i].osm

	printBold "## extract useful data"
	osmosis -q\
		--read-xml tmp/$nameList[$i].osm \
		--tf accept-ways highway=primary \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$nameList[$i].highway-primary.osm \
		\
		--read-xml tmp/$nameList[$i].osm \
		--tf accept-ways highway=secondary \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$nameList[$i].highway-secondary.osm \
		\
		--read-xml tmp/$nameList[$i].osm \
		--tf accept-ways highway=tertiary \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$nameList[$i].highway-tertiary.osm \
		\
		\
		\
		--read-xml tmp/$nameList[$i].osm \
		--tf accept-ways highway="*" \
		--tf reject-ways highway=motorway,motorway_link,trunk,trunk_link,bridleway,steps,proposed,construction,raceway,primary,secondary,tertiary \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$nameList[$i].highway.osm \
		\
		--read-xml tmp/$nameList[$i].osm \
		--tf accept-ways cycleway="*" \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$nameList[$i].cycleway.osm \
		\

	printBold "## xml to GeoJson"
	osmtogeojson tmp/$nameList[$i].highway.osm > tmp/$nameList[$i].highway-primary.json &
	osmtogeojson tmp/$nameList[$i].highway.osm > tmp/$nameList[$i].highway-secondary.json &
	osmtogeojson tmp/$nameList[$i].highway.osm > tmp/$nameList[$i].highway-tertiary.json &
	osmtogeojson tmp/$nameList[$i].cycleway.osm > tmp/$nameList[$i].cycleway.json &
	wait
	

	printBold "## assembling"
	python2 merge-geojsons.py tmp/$nameList[$i].*.json out/$nameList[$i].json

	printBold "## cleaning"
	rm tmp/$nameList[$i]*

	printBold "## compressing"
	pushd out
	bzip2 $nameList[$i].json
	popd
	
	printBold " "
done