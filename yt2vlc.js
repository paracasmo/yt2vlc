var htmlparser = require("htmlparser2");
var request = require('request');
var fs = require('fs');

var playlistId = process.argv[2];
var outputFile = process.argv[3];

var fileStream = fs.createWriteStream(outputFile);

var parser = new htmlparser.Parser({
	onopentag: function(name, attribs) {
		if (name === "tr" && attribs.class.indexOf("pl-video") > -1) {
			fileStream.write(attribs["data-title"] + "(https://www.youtube.com/watch?v=" + attribs["data-video-id"] + ")\n");
		}
	}
});

request('https://www.youtube.com/playlist?list=' + playlistId, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    parser.write(body);
  }
});


fileStream.on('finish', function() {
	parser.end();
	fileStream.end();
});