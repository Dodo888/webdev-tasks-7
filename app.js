var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var projectPath = path.join(__dirname, 'public');

app.set('views', './public');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(projectPath));

module.exports = app;
