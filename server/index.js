// Initialize express and required modules
var express = require('express');
var path = require('path');
var app = express();
// Serve static files
app.use('/', express.static(path.join(__dirname + '/../dist')));
app.use('/pages', express.static(path.join(__dirname + '/../dist/pages')));
app.use('/css', express.static(path.join(__dirname + '/../dist/css')));
app.use('/js', express.static(path.join(__dirname + '/../dist/js')));
app.use('/public/images', express.static(path.join(__dirname + '/../dist/public/images')));
app.use('/fonts', express.static(path.join(__dirname + '/../dist/public/fonts')));
// Listen on port 1337
app.listen(1337);
