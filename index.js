var express = require("express");
var morgan = require("morgan");
var cors = require("cors");
var http = require('http');


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


app.post("/events", function(request, res) {
	console.log("hello");
	var url = "public-api.ticketleap.com";
	var str = '';
	var path = "/events/by/location/";
	console.log(request.body);
	path += request.body.country + "/";
	path += request.body.state + "/";
	path += request.body.city;
	var d = new Date();
	path += "?key=2364318721608674&dates_after=2016" + "-" + d.getMonth() + "-" + d.getDay();
	console.log(path);
	var options = {
  	host: url,
	  port: 80,
	  path: path,
	  method: 'GET'
	};
	callback = function(response) {
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
  	//console.log("str" + str);
  	res.send(JSON.parse(str));
  });
}

  var req = http.request(options, callback);
//This is the data we are posting, it needs to be a string or a buffer
req.end();

	// var req = http.request(options, function(res) {
	// 	 res.setEncoding('utf-8');

 //    	var responseString = '';

 //    	res.on('data', function(data) {
 //     	 responseString += data;
 //   		 });

 //    res.on('end', function() {
 //      console.log(responseString);
 //      var responseObject = JSON.parse(responseString);
 //      success(responseObject);
 //    });
	// });

	// es.search().then(function (events) {
	// 	console.log(JSON.stringify(events));
	//     response.send(events);
	// }).catch(function (error) {
	//     response.send(500);
	// });
});

app.get("/event", function(request, response) {
        response.send("Hi");

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
