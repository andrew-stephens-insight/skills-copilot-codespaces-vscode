// Create web server
// Load comments from file
// Add comments
// Save comments to file
// Send comments to client
// Update comments on client

// Load modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// Load comments from file
var comments = [];
var commentsFile = 'comments.txt';
fs.readFile(commentsFile, function(err, data) {
	if (err) {
		console.log('Error reading comments file');
	} else {
		comments = JSON.parse(data);
	}
});

// Create web server
http.createServer(function(req, res) {
	if (req.method === 'GET') {
		// Send comments to client
		if (url.parse(req.url).pathname === '/comments') {
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(comments));
		} else {
			// Load static files
			fs.readFile(url.parse(req.url).pathname.substring(1), function(err, data) {
				if (err) {
					res.writeHead(404);
					res.end('Not found');
				} else {
					res.end(data);
				}
			});
		}
	} else if (req.method === 'POST') {
		// Add comments
		if (url.parse(req.url).pathname === '/comments') {
			var body = '';
			req.on('data', function(data) {
				body += data;
			});
			req.on('end', function() {
				var newComment = qs.parse(body).comment;
				comments.push(newComment);
				fs.writeFile(commentsFile, JSON.stringify(comments), function(err) {
					if (err) {
						console.log('Error writing comments file');
					}
				});
				res.end();
			});
		} else {
			res.writeHead(404);
			res.end('Not found');
		}
	}
}).listen(8000, '