var htmlparser = require("htmlparser2");
var request = require('request');
var fs = require('fs');

var playlistId = process.argv[2];
var outputFile = process.argv[3];

var video = function(id, title) {
	this.id = id;
	this.title = title;
}

var fileStream = fs.createWriteStream(outputFile);

var parser = new htmlparser.Parser({
	onopentag: function(name, attribs) {
		if (name === "tr" && attribs.class.indexOf("pl-video") > -1) {
			var video = new video(attribs["data-video-id"], attribs["data-title"]);
			fileStream.write(transform2xspf(video));
		}
	}
});

request('https://www.youtube.com/playlist?list=' + playlistId, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    parser.write(body);
  }
});

function transform2xspf(video) {
	return video.title + "(https://www.youtube.com/watch?v=" + video.id + ")\n";
}

fileStream.on('finish', function() {
	parser.end();
	fileStream.end();
});
