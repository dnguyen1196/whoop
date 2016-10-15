'use strict'
// Declare app level module which depends on views, and components
angular.module('myApp', [
        'ngRoute',
        'myApp.view1',
        'myApp.view2',
        'myApp.version',
        'uiGmapgoogle-maps'
    ])
    .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
      GoogleMapApi.configure({
        key: 'AIzaSyBI2B2hZzmW7_NcuQww8GzopJyQrddOBHs',
        libraries: 'weather, geometry, visualization'
      })
    }])
    // .config(['$locationProvider', '$routeProvider', 'uiGmapGoogleMapApiProvider', function($locationProvider, $routeProvider, uiGmapGoogleMapApiProvider) {
    //     $locationProvider.hashPrefix('')
    //     // uiGmapGoogleMapApiProvider.configure({
    //     //         //    key: 'your api key',
    //     //         v: '3.20', //defaults to latest 3.X anyhow
    //     //         libraries: 'weather,geometry,visualization'
    //     //     })
    //         // $routeProvider.otherwise({redirectTo: '/'})
    // }])
    .controller('ListCtrl', ['$route', '$routeParams', '$location', '$scope',
        function ListCtrl($route, $routeParams, $location, $scope) {
            this.$route = $route
            this.$location = $location
            this.$routeParams = $routeParams
            $scope.thing
        }
    ])
    // derick was here
    .controller('MapCtrl', ['$scope', 'uiGmapGoogleMapApi', function MapCtrl($scope, uiGmapGoogleMapApi) {
        $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 }
        uiGmapGoogleMapApi.then(function(maps) {
          console.log(maps)
        })
    }])
