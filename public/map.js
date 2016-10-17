var map;
var data = {};
var itinArray = []; 
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
    center: {
      lat: 42.403685,
      lng: -71.120482
    },
    zoom: 13,
    mapTypeId: 'roadmap',
    styles: [{
      stylers: [
        { hue: '#5fade7' },
        { visibility: 'simplified' },
        { gamma: 0.5 },
        { weight: 0.5 }
      ]
    }, {
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }, {
      featureType: 'water',
      stylers: [{ color: '#5fade7' }]
    }],
    mapTypeControl: false,
    streetViewControl: false
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
    if (places.length == 0) {
      return;
    }
    $("#recommendations").html(""); 
    $("#itinerary").html(""); 
    itinArray = []
    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
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

      var i = 0;
      var d = new Date();
      data.city = places[0].address_components[i].short_name;
      data.city = data.city.split(" ").join("%20");
      i++;
      if (places[0].address_components.length == 4) i++;
      data.state = places[0].address_components[i].short_name;
      data.state = data.state.split(" ").join("%20");
      i++;
      var country = places[0].address_components[i].short_name;
      if (country = "US") country = "USA";
      data.country = country;


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
        for (var i = 0; i < res.events.length; i++) {
          var name = res.events[i].name;
          var latLng = performGeoCoding(res.events[i].venue_street + ", " + res.events[i].venue_city, "event", "event", res.events[i].description, name);
          var marker = new google.maps.Marker({
            position: latLng,
            map: map,
          })
          var contentString = "<b>" + res.events[i].name + "</b><br>" + res.events[i].description;

          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });
          marker.addListener('click', function() {
            infowindow.open(map, marker);
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
    var itinList = $('list-group')
    places.forEach(function(place) {
      console.log(place)
      if (!place.geometry) {
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
      itinList.append($('li').text(place.name))
    });
    map.fitBounds(bounds);
  });
}

var TRIP_API_KEY = "89DE2CFC0C1C43978B484B55F9A514EC";

function get_businesses_info(lat, lng, type) {
  var url = "http://api.tripadvisor.com/api/partner/2.0/map/"
  url += lat + "," + lng + "/" + type + "?";
  url += 'key=' + TRIP_API_KEY;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function(e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        parseReturnData(xhr.responseText, type);
      } else {}
    }
  };
  xhr.send(null);
}



function parseReturnData(xhr, type) {
  var text = JSON.parse(xhr);
  var data = text["data"];
  recommendations = $("#recommendation");
  console.log('hi')
  recommendations.html(""); 
  for (var i = 0; i < data.length; i++) {
    var address = data[i]["address_obj"];
    var str = address["address_string"];
    // recommendations.append("<li>"+ data[i]["name"] +"</li>");
    performGeoCoding(str, type, data[i]);
  }
}
GEO_CODE_API = "AIzaSyDZ6smFYqvu6DIpeKTa2VIlolN-4yIWW_A";

function performGeoCoding(address, type, business, description, name) {
  var url = "https://maps.googleapis.com/maps/api/geocode/json?address="
  var formated = address.split(" ").join("+");
  url += formated;
  url += ("&key=" + GEO_CODE_API);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function(e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        parseGeoCode(xhr.responseText, type, business, description, name, address);
      } else {}
    }
  };
  xhr.send(null);
}

var lastinfowindow = null; 

function parseGeoCode(text, type, business, description, name, address) {
  var data = JSON.parse(text);
  var results = data["results"];
  results = results[0];

  var geometry = results["geometry"];
  var coordinate = geometry["location"];
  var lat = coordinate["lat"];
  var lng = coordinate["lng"];
  addMarkerToMap(lat, lng, type, business, description, name, address);
}
var recNum = 0;

function addToRec(name, address, business, myLatLng) {

  if (business != "event")
    $("#recommendations").append("<a href=\"#\" onclick=\"openWindow(" + recNum + ")\" class=\"list-group-item\"><h4 class=\"list-group-item-heading\">" + business["name"] + "</h4><h5 class=\"list-group-item-text\">" + address + "</h5>");
  else
    $("#recommendations").append("<a href=\"#\" onclick=\"openWindow(" + recNum + ")\" class=\"list-group-item\"><h4 class=\"list-group-item-heading\">" + name + "</h4><h5 class=\"list-group-item-text\">" + address + "</h5>");
  recNum++;
}

function openWindow(num) {
  windowArray[num].open(map, markerArray[num]);
  map.panTo(markerArray[num]["position"]);
}

var markerArray = [];
var windowArray = [];

function addMarkerToMap(lat, lng, type, business, description, name, address) {
  myLatLng = { lat: lat, lng: lng };

  if (type == "restaurants") {
    image_url = "./restaurant.png";
  } else if (type == "event") {
    image_url = "./event.png";
  } else {
    image_url = "./landmark.png";
  }
  var image = {
    url: image_url,
    scaledSize: new google.maps.Size(30, 30),
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(0, 0), // a
  };
  var marker = new google.maps.Marker({
    position: myLatLng,
    icon: image,
    map: map,
  });
  if (business != "event") {
    var contentString = "<b>" + business["name"] + "</b><p>" + business["address_obj"]["address_string"] + "</p>" +
      "<button type='button' class='btn btn-primary' onclick='addToMorning(\"" + business["name"] + "\"," + '\"' + business["address_obj"]["address_string"] + '\")\'' + "> Seems fun!</button>";
  } else var contentString = "<b>" + name + "</b><br>" + address + "<br><br>" + description + "<br><button type='button' class='btn btn-primary' onclick='addToMorning(\"" + name + "\"," + '\"' + address + '\")\'' + "> Seems fun!</button>";
      infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  markerArray.push(marker);
  windowArray.push(infowindow);
  addToRec(name, address, business, myLatLng);
  marker.addListener('click', function() {
    if(lastinfowindow != null) lastinfowindow.close();

    infowindow.open(map, marker);
    lastinfowindow = infowindow;

  });
        myLatLng = { lat: lat, lng: lng };

        if (type == "restaurants") {
                image_url = "./restaurant.png";
        } else if (type == "event") {
                image_url = "./event.png";
        } else {
                image_url = "./landmark.png";
        }
        var image = {
                url: image_url,
                scaledSize: new google.maps.Size(30, 30),
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(0, 0), // a
        };
        var marker = new google.maps.Marker({
                position: myLatLng,
                icon: image,
                map: map,
        });
        if (business != "event") {
                var contentString = "<b>" + business["name"] + "</b><p>Address: " + business["address_obj"]["address_string"] + "</p>" +
                "<p>Rating: " + business["rating"] + "</p>" +
                "<p>Photos: "+ "<a href=\"" + business["see_all_photos"] + "\" target='_blank'>" + "Photos</a>"  + "</p>" +
                "<button type='button' class='btn btn-primary' onclick='addToMorning(\"" + business["name"] + "\"," + '\"' + business["address_obj"]["address_string"]
                + '\")\'' + "> Seems fun!</button>";
        } else var contentString = "<b>" + name + "</b><br>" + address + "<br><br>" + description + "<br><button type='button' class='btn btn-primary' onclick='addToMorning(\"" + name + "\"," + '\"' + address + '\")\'' + "> Seems fun!</button>";
        var infowindow = new google.maps.InfoWindow({
                content: contentString
        });
        marker.addListener('click', function() {
            if(lastinfowindow != null) lastinfowindow.close(); 
                infowindow.open(map, marker);
                lastinfowindow = infowindow;
        });

  myLatLng = { lat: lat, lng: lng };

  if (type == "restaurants") {
    image_url = "./restaurant.png";
  } else if (type == "event") {
    image_url = "./event.png";
  } else {
    image_url = "./landmark.png";
  }
  var image = {
    url: image_url,
    scaledSize: new google.maps.Size(30, 30),
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(0, 0), // a
  };
  var marker = new google.maps.Marker({
    position: myLatLng,
    icon: image,
    map: map,
  });
  if (business != "event") {
    var contentString = "<b>" + business["name"] + "</b><p>Address: " + business["address_obj"]["address_string"] + "</p>" +
      "<p>Rating: " + business["rating"] + "</p>" +
      "<p>Photos: " + "<a href=\"" + business["see_all_photos"] + "\" target='_blank'>" + "Photos</a>" + "</p>" +
      "<button type='button' class='btn btn-primary' onclick='addToMorning(\"" + business["name"] + "\"," + '\"' + business["address_obj"]["address_string"] + '\")\'' + "> Seems fun!</button>";
  } else var contentString = "<b>" + name + "</b><br>" + address + "<br><br>" + description + "<br><button type='button' class='btn btn-primary' onclick='addToMorning(\"" + name + "\"," + '\"' + address + '\")\'' + "> Seems fun!</button>";
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

}



function addToMorning(name, address) {
  $('#modaltitle').text(name);
  $('#timeselect').modal();
  $('#timeselect').on('hide.bs.modal', function(e, stuff) {
    $("itinerary").html(""); 
    var start = moment($('#starttime').val(), 'hh:mm').format('h:mm a')
      // or right after/midnigh
    var end = moment($('#endtime').val(), 'hh:mm').format('h:mm a')
    var itin = {"name": name, "address": address, "start": start, "end": end};
    itinArray.push(itin); 
    itinArray.sort(function (a, b) {
      if (a.start > b.start) {
        return 1;
      }
      if (a.start < b.start) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
    var toAdd = "";
    for(var i = 0; i < itinArray.length; i++) {
        toAdd += "<a href=\"#\" class=\"list-group-item\"><h4 class=\"list-group-item-heading\">" + itinArray[i].name + "</h4><h5 class=\"list-group-item-text\">" +  itinArray[i].address + "</h5><p>" +  itinArray[i].start + ' - ' +  itinArray[i].end + "</p></a>";
    }
    $('#itinerary').html(toAdd);
    $(e.currentTarget).unbind();
  })
}


function sortItin() {
  var itin = $('#itinerary')
  var sorted = itin.children().sort(function(a, b) {
    var atimes = $(a).find($('p'))[0].innerHTML.split(' - ')
    var btimes = $(b).find($('p'))[0].innerHTML.split(' - ')
    var diff = moment(atimes[0]) - moment(btimes[0])
    if (diff !== 0) {
      return diff
    } else {
      return moment(atimes[1]) - moment(btimes[1])
    }
  })
  $(itin).append(sorted)
}

$('#getstarted').click(function(e) {
  $('#welcome').addClass('hidden')
  $('#all-content').removeClass('none').addClass('all')
})
