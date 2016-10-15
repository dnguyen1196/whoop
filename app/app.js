'use strict'

var geocoder = new google.maps.Geocoder()

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'myApp.view2',
    'myApp.version',
    'uiGmapgoogle-maps',
    'angular-google-maps-geocoder'
  ])
  .config(['uiGmapGoogleMapApiProvider', function(GoogleMapApi) {
    GoogleMapApi.configure({
      key: 'AIzaSyBI2B2hZzmW7_NcuQww8GzopJyQrddOBHs',
      libraries: 'weather, geometry, visualization'
    })
  }])
  .controller('MainCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
    $scope.placeID
    $scope.addressToSearch
    $scope.placeQuery = function() {
      geocoder.geocode({ 'address': $scope.addressToSearch }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
          var location = results[0].geometry.location
          console.log(results)
          $rootScope.$broadcast('SearchSuccess', location)
        }
      })
    }
  }])
  .controller('ListCtrl', ['$route', '$routeParams', '$location', '$scope',
    function ListCtrl($route, $routeParams, $location, $scope) {
      this.$route = $route
      this.$location = $location
      this.$routeParams = $routeParams
    }
  ])
  // derick was here
  .controller('MapCtrl', ['$scope', 'uiGmapGoogleMapApi', '$rootScope', function MapCtrl($scope, uiGmapGoogleMapApi, $rootScope) {
    $scope.mapOptions = {
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

    }
    $scope.map = {
      center: {
        latitude: 42.403685,
        longitude: -71.120482
      },
      zoom: 16
    }
    $rootScope.$on('SearchSuccess', function (something, newLoc) {
      $scope.map.center.latitude = newLoc.lat()
      $scope.map.center.longitude = newLoc.lng()
    })
    uiGmapGoogleMapApi.then(function(maps) {})
  }])
