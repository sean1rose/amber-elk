var express = require('express');
var path = require('path');
var app = express();
app.use("/", express.static(path.join(__dirname + '/../client')));
app.use("/styles", express.static(path.join(__dirname + '/../client/styles')));
app.listen(1337);
