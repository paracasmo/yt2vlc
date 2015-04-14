var htmlparser = require("htmlparser2");
var parser = new htmlparser.Parser({
	onopentag: function(name, attribs) {
		if (name === "tr" && attribs.class.indexOf("pl-video") > -1) {
			console.log(attribs["data-title"] + "(https://www.youtube.com/watch?v=" + attribs["data-video-id"] + ")");
		}
	}
});
parser.write("<tr class=\"pl-video yt-uix-tile \" data-title=\"Coffee with a Googler: Android Auto Product Manager Andrew Brenner\" data-video-id=\"QQF40qveBjg\" data-set-video-id=\"\">");
parser.end();