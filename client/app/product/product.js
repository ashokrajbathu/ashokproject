'use strict';

angular.module('shopnxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('product', {
        title: 'People administration (Add, Remove, Edit)',
        url: '/people',
        templateUrl: 'app/product/people.html',
        controller: 'ProductCtrl',
        authenticate: true
      });
  });
