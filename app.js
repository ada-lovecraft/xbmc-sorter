var tvrager = require('tvrager');
var util = require('util');
var fs = require('fs.extra');

var showFiles = [];

fs.readdir('raw/', function(err,files) {
	if (err)
		throw err;
	files.forEach(function(el,index,array) {
		var stats = fs.lstatSync('raw/' + el);
		if (stats.isDirectory() == false) {
			showFiles.push({file: el, path: 'raw/'+el});
		} else {

			var innerFiles = fs.readdirSync('raw/'+el+'/');
			innerFiles.forEach(function(file,index,array) {
				console.log(file);
				showFiles.push({file: file, path: 'raw/'+el+'/'+file});
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

			fs.move('raw/'+el.path,'sorted/'+showName+'/Season ' + season + '/'+el.file);
		}
		else 
			console.log("COULD NOT IDENTIFY: " + el)
	});
});

function showExists(showName) {
	return fs.existsSync('sorted/' + showName);
}

function createShow(showName) {
	console.log('creating show: ' + showName);
	fs.mkdirSync('sorted/' + showName);
}

function seasonExists(showName,season) {
	return fs.existsSync('sorted/' + showName + "/Season " + season);
}

function createSeason(showName,season) {
	console.log('creating season: ' + showName + ' Season ' + season)
	fs.mkdirSync('sorted/' + showName + "/Season " + season);
}