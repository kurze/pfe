#! /bin/zsh


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
    "reunion-latest"
    "rhone-alpes-latest"
)

mkdir out

for ((i=1; $i <= $#urlList; i++)) do
    curl $urlList[$i] > tmp
    cat tmp | bzcat > tmp2
    rm tmp
    cat tmp2 | ./importation.js > out/$nameList[$i].json
    rm tmp2
done

