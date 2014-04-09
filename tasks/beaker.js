'use strict';

var path = require('path'), fs = require('fs');

module.exports = function (grunt) {
	var sizes_data;
	var sizes_store;

	grunt.registerMultiTask('beaker', 'Measure your file size', function () {
		var src = this.data.src;
		var options = this.options();

		sizes_store = options.dataStore;

		// was sizes file passed?
		if(!sizes_store){
			grunt.fail.fatal("sizes file was not passed, please specify it.");
		}
		else{
			sizes_data = parseSizesFile();
		}
		
		// recursively find files to process
		grunt.file.recurse(src, function(path) {
			addToDataObject(path, fs.statSync(path).mtime.getTime(), fs.statSync(path).size);
		});

		fs.writeFileSync(sizes_store, JSON.stringify(sizes_data), 'utf8');
	});
	
	function parseSizesFile (){
		// check if dataStore file exists
		if(!grunt.file.exists(sizes_store)){
			grunt.fail.fatal("sizes file does not exist, please create an empty file.");
		}

		var data = fs.readFileSync(sizes_store, 'utf8');
		if(data === ''){
			data = '{}'; // default, in case its a 0b file 
		}
		
		try{
			return JSON.parse(data);
		} catch (e) {
			grunt.fail.fatal("Problem parsing the sizes file: ", e);
		}
	}

	// create the correct data structure and write it to the file
	function addToDataObject(file_path, time, size){
		var file_ext = path.extname(file_path).replace('.','');
		var file_name = path.basename(file_path);

		// create file type object if it doesnt exist
		if(sizes_data[file_ext] === undefined){
			sizes_data[file_ext] = {};
		}

		// create file array
		if(sizes_data[file_ext][file_name] === undefined){
			sizes_data[file_ext][file_name] = [];
		}

		grunt.log.writeln(file_path + " .... " + size + "b");

		sizes_data[file_ext][file_name].push({
			date: time,
			size: size
		});
	}
};
