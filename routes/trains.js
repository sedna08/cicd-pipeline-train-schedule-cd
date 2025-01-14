var express = require('express');
var router = express.Router();
var low = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync')

var path = require('path');
var adapter = new FileSync(path.join(__dirname, 'data', 'trains.json'));
// var adapter = new FileSync('data/trains.json')
var db = low(adapter)

console.log('Current working directory:', process.cwd());
/* GET trains listing. */
router.get('/', function(req, res, next) {
  res.send(db.get('trains').sortBy('name').value());
});

module.exports = router;
