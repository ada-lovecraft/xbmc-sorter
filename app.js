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
			console.log('is not a directory');
			showFiles.push({file: el, path: 'raw/'+el});
		} else {

			console.log(el + ' is a directory')
			var innerFiles = fs.readdirSync('raw/'+el+'/');
			console.log(innerFiles);
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
			console.log('showname: ' + showName);
			var seasonToken = el.file.match(/S\d+(?=E\d+)/)[0].replace(/S/,''); 
			var season = parseInt(seasonToken)
			console.log('showExists: ' + showExists(showName));
			if (showExists(showName) == false) {
				//create show folder
				createShow(showName)
			}
			// check for season folder
			console.log('seasonExists: ' + seasonExists(showName, season));
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
	console.log(showName + ' exists: ' + fs.existsSync('sorted/' + showName));
	return fs.existsSync('sorted/' + showName);
}

function createShow(showName) {
	console.log('creating: ' + showName);
	fs.mkdirSync('sorted/' + showName);
}

function seasonExists(showName,season) {
	return fs.existsSync('sorted/' + showName + "/Season " + season);
}

function createSeason(showName,season) {
	console.log('creating season: ' + showName + ' ' + season)
	fs.mkdirSync('sorted/' + showName + "/Season " + season);
}