'use strict'

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
  .controller('MainCtrl', ['$rootScope', function($rootScope) {
    $rootScope.placeID
    $scope.placeQuery
  }])
  .controller('ListCtrl', ['$route', '$routeParams', '$location', '$scope',
    function ListCtrl($route, $routeParams, $location, $scope) {
      this.$route = $route
      this.$location = $location
      this.$routeParams = $routeParams
    }
  ])
  // derick was here
  .controller('MapCtrl', ['$scope', 'uiGmapGoogleMapApi', function MapCtrl($scope, uiGmapGoogleMapApi) {
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
      zoom: 15
    }
    uiGmapGoogleMapApi.then(function(maps) {
    })
  }])
