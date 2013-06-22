var tvrager = require('tvrager');
var util = require('util');
var fs = require('fs.extra');

var showFiles = [];
var BASE_DIR = '../raw/'
var DESTINATION_DIR = '../tv/';
fs.readdir(BASE_DIR, function(err,files) {
	if (err)
		throw err;
	files.forEach(function(el,index,array) {
		var stats = fs.lstatSync(BASE_DIR + el);
		if (stats.isDirectory() == false) {
			showFiles.push({file: el, path: BASE_DIR+el});
		} else {

			var innerFiles = fs.readdirSync(BASE_DIR+el+'/');
			innerFiles.forEach(function(file,index,array) {
				console.log(file);
				showFiles.push({file: file, path: BASE_DIR+el+'/'+file});
			});
		}
	});

	showFiles.forEach(function(el,index,array) {
		var showName = el.file.match(/.*(?=.S\d+E\d+)/);
		if (showName) {
			showName = showName[0].replace(/\./g,' ')
			var seasonToken = el.file.match(/S\d+(?=E\d+)/)[0].replace(/S/,''); 
			var season = parseInt(seasonToken)
			if (showExists(showName) == false) {
				//create show folder
				createShow(showName)
			}
			// check for season folder
			if (seasonExists(showName,season) == false) {
				createSeason(showName,season)
			} 	

			fs.move(BASE_DIR+el.path,'tv/'+showName+'/Season ' + season + '/'+el.file);
		}
		else 
			console.log("COULD NOT IDENTIFY: " + el)
	});
});

function showExists(showName) {
	return fs.existsSync(DESTINATION_DIR + showName);
}

function createShow(showName) {
	console.log('creating show: ' + showName);
	fs.mkdirSync(DESTINATION_DIR + showName);
}

function seasonExists(showName,season) {
	return fs.existsSync(DESTINATION_DIR + showName + "/Season " + season);
}

function createSeason(showName,season) {
	console.log('creating season: ' + showName + ' Season ' + season)
	fs.mkdirSync(DESTINATION_DIR + showName + "/Season " + season);
}