#! /bin/zsh

printBold(){
	echo "\033[1m"$1 $2"\033[0m"
}

urlList=(
	"http://download.geofabrik.de/europe/france/alsace-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/aquitaine-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/auvergne-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/basse-normandie-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/bourgogne-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/bretagne-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/centre-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/champagne-ardenne-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/corse-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/franche-comte-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/guadeloupe-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/guyane-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/haute-normandie-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/ile-de-france-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/languedoc-roussillon-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/limousin-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/lorraine-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/martinique-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/mayotte-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/midi-pyrenees-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/nord-pas-de-calais-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/pays-de-la-loire-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/picardie-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/poitou-charentes-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/provence-alpes-cote-d-azur-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/reunion-latest.osm.pbf"
	"http://download.geofabrik.de/europe/france/rhone-alpes-latest.osm.pbf"
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

	printBold "#" $nameList[$i]

	printBold "## download and inflate"
	curl $urlList[$i] > tmp/$nameList[$i].osm.pbf

	printBold "## extract useful data"
	osmosis -q \
		--rbf tmp/$nameList[$i].osm.pbf \
		--tf accept-ways highway=primary \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$nameList[$i].highway-primary.osm \
		\
		--rbf tmp/$nameList[$i].osm.pbf \
		--tf accept-ways highway=secondary \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$nameList[$i].highway-secondary.osm \
		\
		--rbf tmp/$nameList[$i].osm.pbf \
		--tf accept-ways highway=tertiary \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$nameList[$i].highway-tertiary.osm \
		\
		--rbf tmp/$nameList[$i].osm.pbf \
		--tf accept-ways highway=unclassified \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$nameList[$i].highway-unclassified.osm \
		\
		--rbf tmp/$nameList[$i].osm.pbf \
		--tf accept-ways highway=primary_link,secondary_link,tertiary_link \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$nameList[$i].highway-link.osm \
		\
		--rbf tmp/$nameList[$i].osm.pbf \
		--tf accept-ways highway=road \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$nameList[$i].highway-road.osm \
		\
		--rbf tmp/$nameList[$i].osm.pbf \
		--tf accept-ways highway=residential \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$nameList[$i].highway-residential.osm \
		\
		--rbf tmp/$nameList[$i].osm.pbf \
		--tf accept-ways highway=service \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$nameList[$i].highway-service.osm \
		\
		--rbf tmp/$nameList[$i].osm.pbf \
		--tf accept-ways highway=track \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$nameList[$i].highway-track.osm \
		\
		--rbf tmp/$nameList[$i].osm.pbf \
		--tf accept-ways highway="*" \
		--tf reject-ways highway=motorway,motorway_link,trunk,trunk_link,bridleway,steps,proposed,construction,raceway,primary,secondary,tertiary,unclassified,primary_link,secondary_link,tertiary_link,road,residential,service,track \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$nameList[$i].highway-other.osm \
		\
		--rbf tmp/$nameList[$i].osm.pbf \
		--tf accept-ways cycleway="*" \
		--tf reject-relations \
		--used-node \
		--write-xml tmp/$nameList[$i].cycleway.osm \
		\

	printBold "## xml to GeoJson"
	osmtogeojson tmp/$nameList[$i].highway-primary.osm > tmp/$nameList[$i].highway-primary.json &
	osmtogeojson tmp/$nameList[$i].highway-secondary.osm > tmp/$nameList[$i].highway-secondary.json &
	osmtogeojson tmp/$nameList[$i].highway-tertiary.osm > tmp/$nameList[$i].highway-tertiary.json &
	osmtogeojson tmp/$nameList[$i].highway-unclassified.osm > tmp/$nameList[$i].highway-unclassified.json &
	wait
	osmtogeojson tmp/$nameList[$i].highway-link.osm > tmp/$nameList[$i].highway-link.json &
	osmtogeojson tmp/$nameList[$i].highway-road.osm > tmp/$nameList[$i].highway-road.json &
	osmtogeojson tmp/$nameList[$i].highway-other.osm > tmp/$nameList[$i].highway-other.json &
	osmtogeojson tmp/$nameList[$i].cycleway.osm > tmp/$nameList[$i].cycleway.json &
	wait
	osmtogeojson tmp/$nameList[$i].highway-residential.osm > tmp/$nameList[$i].highway-residential.json &
	osmtogeojson tmp/$nameList[$i].highway-service.osm > tmp/$nameList[$i].highway-service.json &
	osmtogeojson tmp/$nameList[$i].highway-track.osm > tmp/$nameList[$i].highway-track.json &
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