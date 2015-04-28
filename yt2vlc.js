#! /usr/bin/env node

var htmlparser = require("htmlparser2");
var request = require('request');
var fs = require('fs');

var playlistId = process.argv[2];
var outputFile = process.argv[3];
var vidCount = 0;

var video = function(id, title) {
	this.id = id;
	this.title = title;
}

var fileStream = fs.createWriteStream(outputFile);

var parser = new htmlparser.Parser({
	onopentag: function(name, attribs) {
		if (name === "tr" && attribs.class.indexOf("pl-video") > -1) {
			var curVideo = new video(attribs["data-video-id"], attribs["data-title"]);
			fileStream.write(transform2xspf(curVideo));
			vidCount++;
		}
	}
});

request('https://www.youtube.com/playlist?list=' + playlistId, function (error, response, body) {

	fileStream.write(writeHeader());
	
	if (!error && response.statusCode == 200) {
		parser.write(body);
	}
	
	fileStream.write(writeFooter());
});

fileStream.on('finish', function() {
	parser.end();
	fileStream.end();
});

function writeHeader() {
	return '<?xml version="1.0" encoding="UTF-8"?>\n<playlist xmlns="http://xspf.org/ns/0/" xmlns:vlc="http://www.videolan.org/vlc/playlist/ns/0/" version="1">\n<title>Playlist</title>\n<trackList>\n';
}

function transform2xspf(video) {
	return '<track><location>https://www.youtube.com/watch?v=' + video.id + '</location><title>' + video.title + '</title><extension application="http://www.videolan.org/vlc/playlist/0"><vlc:id>' + vidCount + '</vlc:id><vlc:option>network-caching=1000</vlc:option></extension></track>\n';
}

function writeFooter() {
	var top = '</trackList>\n<extension application="http://www.videolan.org/vlc/playlist/0">\n';
	var middle = '';
	for(i = 0; i<= vidCount; i++) {
		middle+='<vlc:item tid="' + i + '"/>\n';
	}
	
	var bottom = '</extension>\n</playlist>';

	return top + middle + bottom;
}