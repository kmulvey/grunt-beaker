'use strict';

var path = require('path'), fs = require('fs');

module.exports = function (grunt) {
	grunt.registerMultiTask('beaker', 'Measure your file size', function () {
		var options = this.options();
		var sizes_store = options.dataStore;
		
		var sizes_data = null;
		
		// was sizes file passed?
		if(!sizes_store){
			grunt.fail.fatal("sizes file was not passed, please specify it.");
		}
		else{
			sizes_data = parseSizesFile(sizes_store);
		}
		
		// recursively find files to process
		this.filesSrc.forEach(function(filepath) {
			grunt.file.recurse(filepath, function(abspath) {
				statFile(abspath, sizes_data, sizes_store);
			});
		});
	});
	
	function parseSizesFile (sizes_store){
		// check if dataStore file exists
		if(!grunt.file.exists(sizes_store)){
			file.writeFileSync(sizes_storw, "{}");
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
	
	// return the mtime and sizefor file
	function statFile(path, sizes_data, sizes_file_path){
		writeFileData(path, fs.statSync(path).mtime.getTime(), fs.statSync(path).size, sizes_data, sizes_file_path);
	}
	
	// create the correct data structure and write it to the file
	function writeFileData(file_path, time, size, sizes_data, sizes_file_path){
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
		var time_obj = {
			date: time,
			size: size
		};
		grunt.log.writeln(file_path + " .... " + size + "b");
		
		sizes_data[file_ext][file_name].push(time_obj);
		fs.writeFileSync(sizes_file_path, JSON.stringify(sizes_data), 'utf8');
	}
};
