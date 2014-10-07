tags=(v1.0.0 v1.1.0 v1.1.1 v1.2.0 v1.3.0 v1.4.0 v2.0.0 v2.0.1 v2.0.2 v2.0.3 v2.0.4 v2.1.0 v2.1.1 v2.2.0 v2.2.1 v2.2.2 v2.3.0 v2.3.1 v2.3.2 v3.0.0 v3.0.0-rc.2 v3.0.0-rc1 v3.0.1 v3.0.2 v3.0.3 v3.1.0 v3.1.1) 
for t in "${tags[@]}"	
do
	echo $t
	git checkout $t
	NEWDATE=`git show -s --format=%ci ${t} --pretty="%ai"`

	cp ../beaker.json ../beaker_fill.sh ../km.js ./
	
	#grunt build
	find docs/ docs-assets/ -name '*min*' -exec touch -d "$NEWDATE" {} \;
	grunt --gruntfile km.js beaker --force

	cp beaker.json ../
	git undo HEAD
	git clean -f
done
