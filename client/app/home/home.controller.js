'use strict';

angular.module('yokelApp')
  .controller('HomeController', function($scope, $http, loadSearch){
    $scope.map = {
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 8
    };
    $scope.data = {};
    $scope.searchNearby = loadSearch.searchNearby;
    $scope.searchNearby()
      .then(function(businesses){
        $scope.data = businesses.data;
      });
  })

  .controller('mapController', function($scope){
      $scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
      $scope.options = {scrollwheel: false};
  })

  //needs to locate and search on init
  .factory('locate', function(){
    var locateUser = function(){
      navigator.geolocation.watchPosition(function(position){
        var userPosition = [position.coords.latitude, position.coords.longitude];
        return userPosition;
      });
    };
    var locateUserForSearch = function(){
      navigator.geolocation.watchPosition(function(position){
        var userPosition = position.coords.latitude + '/' + position.coords.longitude;
        return userPosition;
      });
      
    };
    return {
      locateUser: locateUser,
      locateUserForSearch: locateUserForSearch
    };
  })

  //searches for businesses on load
  .factory('loadSearch', function($http, locate){
    var searchNearby = function(){
      var searchObj = {
        position: locate.locateUserForSearch()
      };
      return $http({
        method: 'GET',
        url: 'api/nearby/' +  '45/-73'
      }).success(function(businesses){
        return businesses;
      });
    };
    return {
      searchNearby: searchNearby
    };
  });

  







