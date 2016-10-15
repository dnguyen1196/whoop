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
              for(int i = 0; i < res.events.length; i ++) {
                var marker = new google.maps.Marker({
                  position: , 
                  map: map
                }
              }
              map.addMarker(new MarkerOptions()
        .position(new LatLng(data.lat, data.lng))
        .title("Hello world"));
            }
        });
        });
      }
