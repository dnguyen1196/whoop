var express = require("express");
var morgan = require("morgan");
var cors = require("cors");


// Own modules
var EventSearch = require("facebook-events-by-location-core");

// Create the Express object
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use morgan for logging
app.use(morgan("combined"));

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
        response.sendFile("./public/index.html");
});

// Instantiate CORS whitelist

// var es = new EventSearch({
// "accessToken":"1149596415132442|hlbvMEjn4RxBx6YropCuZ7LlJKw",
//     "lat": 40.710803,
//     "lng": -73.964040
// });
//
// es.search().then(function (events) {
//     console.log(JSON.stringify(events));
// }).catch(function (error) {
//     console.error(JSON.stringify(error));
// });
app.post("/events", function(request, response) {
	var lat = request.body.lat;
	var lng = request.body.lng;
	console.log(lat);
	var es = new EventSearch({
		"accessToken":"1149596415132442|hlbvMEjn4RxBx6YropCuZ7LlJKw",
	    "lat": lat,
	    "lng": lng	
	});

	es.search().then(function (events) {
		console.log(JSON.stringify(events));
	    response.send(events);
	}).catch(function (error) {
	    response.send(500);
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
