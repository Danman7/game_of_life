var express = require('express');
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var gol = require("./server/game-of-life.js");
var port = 3000;

// parse application/json
app.use(bodyParser.json());

// set static filex
app.use('/', express.static(path.join(__dirname, 'client')))

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});

// get next iteration of GOL
app.post('/getNextGeneration', function(req, res) {
    res.send(gol.calculateNextGridCycle(req.body));
});

app.listen(port, function() {
    console.log('Server listening on port ' + port + '!');
})