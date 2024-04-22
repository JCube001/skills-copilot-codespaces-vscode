// Create web server
// 1. Create a web server
// 2. Handle comment form submission
// 3. Read comments from file
// 4. Add comment to file
// 5. Display comments
// 6. Add form for new comments

// Load modules
var http = require('http');
var fs = require('fs');
var qs = require('querystring');

// Global variables
var comments = [];
var comments_file = 'comments.txt';
var form = fs.readFileSync('form.html');

// Read comments from file
function readComments() {
  fs.readFile(comments_file, function(err, data) {
    if (err) {
      console.log('Error reading file: ' + comments_file);
      return;
    }
    comments = JSON.parse(data);
    console.log('Read comments: ' + comments);
  });
}

// Add comment to file
function addComment(comment) {
  comments.push(comment);
  fs.writeFile(comments_file, JSON.stringify(comments), function(err) {
    if (err) {
      console.log('Error writing file: ' + comments_file);
      return;
    }
    console.log('Added comment: ' + comment);
  });
}

// Display comments
function displayComments(response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write('<h1>Comments</h1>');
  response.write('<ul>');
  comments.forEach(function(comment) {
    response.write('<li>' + comment + '</li>');
  });
  response.write('</ul>');
  response.write(form);
  response.end();
}

// Create web server
http.createServer(function(request, response) {
  if (request.method == 'POST') {
    var body = '';
    request.on('data', function(data) {
      body += data;
    });
    request.on('end', function() {
      var comment = qs.parse(body).comment;
      addComment(comment);
      displayComments(response);
    });
  } else {
    readComments();
    displayComments(response);
  }
}).listen(8080);

console.log('Server running at http://localhost:8080/');
