'use strict';

var path = require('path'), fs = require('fs');

module.exports = function (grunt) {
	grunt.registerMultiTask('tape', 'Keep track of file sizes', function () {
		var src = this.data.src;
		var options = this.options();
		var sizes_store = options.version;
		var collect_data = options.collectData;
		var sma = options.printSMA;
		
		if(collect_data){
			// was sizes file passed?
			if(!sizes_store){
				grunt.fail.fatal("sizes file was not passed, please specify it.");
			}
			
			// check if version file exists
			if(!grunt.file.exists(sizes_store)){
				grunt.fail.fatal("sizes file does not exist, please create an empty file.");
			}

			// find files to process
			grunt.file.recurse(src, function(abspath) {
				statFile(abspath, sizes_store);
			});
		}
		else{
			
		}
	});
	
	// recursively search the directory for files and return the mtime for each
	function statFile(path, sizes_store){
		var dt = new Date(fs.statSync(path).mtime).getTime();
		writeFileData(path, dt, fs.statSync(path).size, sizes_store);
	}
	
	function writeFileData(file, time, size, sizes_store){
		var data = fs.readFileSync(sizes_store, 'utf8');
		if(data === ''){
			data = '{}'; // default, in case its a 0b file 
		}
		
		try{
			data = JSON.parse(data);
		} catch (e) {
			grunt.fail.fatal("Problem parsing the sizes file: ", e);
		}
		
		// create file type object if it doesnt exist
		if(data[path.extname(file).replace('.','')] === undefined){
			data[path.extname(file).replace('.','')] = {};
		}
		
		// create file array
		if(data[path.extname(file).replace('.','')][path.basename(file)] === undefined){
			data[path.extname(file).replace('.','')][path.basename(file)] = [];
		}
		var time_obj = {};
		time_obj[time] = size;
		grunt.log.writeln(file + " .... " + size + "b");
		
		data[path.extname(file).replace('.','')][path.basename(file)].push(time_obj);
		fs.writeFileSync(sizes_store, JSON.stringify(data), 'utf8');
	}
};
