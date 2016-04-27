'use strict';
var path = require('path');
var htmlPath = path.join(__dirname, 'public/index.html');

module.exports = (req, res) => {
    res.sendFile(htmlPath);
};