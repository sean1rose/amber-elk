// Initialize express and required modules
var express = require('express');
var path = require('path');
var app = express();
// Serve static files
app.use("/", express.static(path.join(__dirname + '/../client')));
app.use("/styles", express.static(path.join(__dirname + '/../client/styles')));
// Listen on port 1337
app.listen(1337);
