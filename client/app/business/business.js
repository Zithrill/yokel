'use strict';

angular.module('yokelApp')
  .config(function($stateProvider){
    $stateProvider
      .state('business', {
        url: '/business',
        templateUrl: 'app/business/business.html',
        controller: 'BusinessController'
      });
  });