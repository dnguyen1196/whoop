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
            	console.log(data);
            }
        });
    });
});

// function centerMap() {
// 	console.log("hi");
// 	console.log("ya1u");
// 	var LatLng = new google.maps.LatLng(lat, lng);
// 	var lat = document.getElementById("lat").val();
// 	var lng = document.getElementById("lng").val();
// 	var map = new google.maps.Map(document.getElementById("map"), {
//       styles: [{
//         stylers: [
//           { hue: '#5fade7' },
//           { visibility: 'simplified' },
//           { gamma: 0.5 },
//           { weight: 0.5 }
//         ]
//       }, {
//         elementType: 'labels',
//         stylers: [{ visibility: 'off' }]
//       }, {
//         featureType: 'water',
//         stylers: [{ color: '#5fade7' }]
//       }],
//       mapTypeControl: false,
//       streetViewControl: false,
//       center: LatLng

//     });
// 	console.log("hfuioasd");
//     map.panTo(LatLng);
//     console.log("yau");
// }