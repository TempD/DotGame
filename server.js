// server.js
// where your node app starts

// init project
var express = require('express');
var sassMiddleware = require('node-sass-middleware');
var app = express();

app.use(sassMiddleware({
    src: __dirname + '/sass',
    dest: __dirname + '/public',
    indentedSyntax: true,
    debug: true,
    outputStyle: 'compressed'
}));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(express.static('/tmp'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(7777, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});