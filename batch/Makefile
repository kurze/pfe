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

cleanAll: clean
	rm -rf node_modules merge-geojsons.py 3759608

run:
	zsh batch.zsh