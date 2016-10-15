var map;
var data = {};

$(function() {
    $('form').submit(function() {
      var data = {};
      data.lat = $("#lat").val();
      data.lng = $("#lng").val();
        $.ajax({
            type: 'post',
            url: '/events',
            data: data,
            success: function(data) {
              
            }
        });
    });
});

function makeMarkers(lat, lng) {

}


function initAutocomplete() {
        map = new google.maps.Map(document.getElementById('googlemap'), {
                center: {lat: -33.8688, lng: 151.2195},
                zoom: 13,
                mapTypeId: 'roadmap'
        });



        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
                searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();
          console.log(places.length);
          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            data.lat = places[0].geometry.location.lat();
            data.lng = places[0].geometry.location.lng();
            console.log("lat: " + data.lat);
            console.log("lng: " + data.lng);
            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);

          $.ajax({
            type: 'post',
            url: '/events',
            data: data,
            success: function(res) {
              console.log(res);
              for(var i = 0; i < res.events.length; i ++) {
                var latLng = performGeoCoding(res.events[i].venue_street);
                var marker = new google.maps.Marker({
                  position: latLng,
                  map: map
                });
              }
            }
        });
                var places = searchBox.getPlaces();

                if (places.length == 0) {
                        return;
                }
                // Clear out the old markers.
                markers.forEach(function(marker) {
                        marker.setMap(null);
                });
                markers = [];
                // For each place, get the icon, name and location.
                var bounds = new google.maps.LatLngBounds();
                places.forEach(function(place) {
                        if (!place.geometry) {
                                console.log("Returned place contains no geometry");
                                return;
                        }
                        var icon = {
                                url: place.icon,
                                size: new google.maps.Size(71, 71),
                                origin: new google.maps.Point(0, 0),
                                anchor: new google.maps.Point(17, 34),
                                scaledSize: new google.maps.Size(25, 25)
                        };
                        var lat = place.geometry.location.lat();
                        var lng = place.geometry.location.lng();
                        get_businesses_info(lat, lng, "attractions");
                        get_businesses_info(lat, lng, "restaurants");
                        // Create a marker for each place.
                        markers.push(new google.maps.Marker({
                                map: map,
                                icon: icon,
                                title: place.name,
                                position: place.geometry.location
                        }));

                        if (place.geometry.viewport) {
                                // Only geocodes have viewport.
                                bounds.union(place.geometry.viewport);
                        } else {
                                bounds.extend(place.geometry.location);
                        }
                });
                map.fitBounds(bounds);
        });
}


var TRIP_API_KEY = "89DE2CFC0C1C43978B484B55F9A514EC";


function get_businesses_info(lat, lng, type){
        var url = "http://api.tripadvisor.com/api/partner/2.0/map/"
        url += lat + ","+ lng + "/" + type + "?";
        url += 'key=' + TRIP_API_KEY;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function (e) {
                if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                                console.log(xhr.responseText);
                                parseReturnData(xhr.responseText, type);
                                displayItems(xhr.responseText, type);
                        } else {
                                console.error(xhr.statusText);
                        }
                }
        };
        xhr.send(null);
}

function displayItems(text, type) {
        data = JSON.parse(text);
        recommendations = $("#itinerary");
        for (var i = 0; i < data.length; i++) {
                recommendations.append("<li>Item</li>");
        }
}

function parseReturnData(xhr, type){
        var text = JSON.parse(xhr);
        var data = text["data"];
        for (var i = 0; i < data.length; i++) {
                var address = data[i]["address_obj"];
                var str = address["address_string"];
                performGeoCoding(str, type);
        }
}
GEO_CODE_API = "AIzaSyDZ6smFYqvu6DIpeKTa2VIlolN-4yIWW_A";

function performGeoCoding(address, type) {
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address="
        var formated = address.split(" ").join("+");
        url += formated;
        url += ("&key=" + GEO_CODE_API);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function (e) {
                if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                                parseGeoCode(xhr.responseText, type);
                        } else {
                                console.error(xhr.statusText);
                        }
                }
        };
        xhr.send(null);
}

function parseGeoCode(text, type) {
        var data = JSON.parse(text);
        var results = data["results"];
        results = results[0];

        var geometry = results["geometry"];
        var coordinate = geometry["location"];
        var lat = coordinate["lat"];
        var lng = coordinate["lng"];
        addMarkerToMap(lat, lng, type);
}

function addMarkerToMap(lat, lng, type) {
        myLatLng = {lat:lat, lng:lng};

        if (type=="restaurants"){
                image_url = "./restaurant.png";
        } else {
                image_url ="./landmark.png";
        }
        var image = {
                url: image_url,
                scaledSize: new google.maps.Size(30, 30),
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(0,0), // a
        };
        var marker = new google.maps.Marker({
                position: myLatLng,
                icon: image,
                map: map,
        });
}
