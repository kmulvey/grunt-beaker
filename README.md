[![Build Status](https://travis-ci.org/kmulvey/grunt-beaker.svg?branch=master)](https://travis-ci.org/kmulvey/grunt-beaker)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

Grunt Beaker
==========

Measure your file size and keep track of them over time.


### Why?

Over time you add more features, fix the bugs and generally add more code.  Understanding where all the growth is happening is important for maintaining your project. Grunt beaker maintains a json file with the date and size of files you tell it about and over time you can graph this data to see trends or to compare files against each other. 

### Modes


#### Collect mode:
Collect mode recursively searches the path you supply looking for files and retrieves the mtime and size of each file.  The data is organized by file type, file and data as below.

```
file_ext
├── file_name
│   ├── [{date: d, size: s}, {date: d, size: s}] 
```

The data object collects mtime at millisecond resolution from getTime() and size in bytes.


#### Sample config:

```
'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    beaker: {
      js: {
        src: 'tasks/',
        options: {
			collectData: true,
			dataStore: 'beaker.json'
        }
      },
      calc: {
        options: {
		    sma: 5,
			key: 'js',
			dataStore: 'beaker.json'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-beaker');
};

```



#### Sample JSON output:

```
{
    "js": {
        "beaker.js": [
            {
                "date": 1396392961000,
                "size": 2631
            },
            {
                "date": 1396393174000,
                "size": 2653
            },
            {
                "date": 1396393220000,
                "size": 2679
            },
            
        ]
    }
}
```
