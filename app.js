var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var projectPath = path.join(__dirname, 'public');

app.set('views', './public');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(projectPath));

require('./routes')(app);

//app.use(function (req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});

module.exports = app;
