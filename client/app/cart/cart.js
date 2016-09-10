'use strict';

angular.module('shopnxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('shortlist', {
        title: 'Details of people short listed',
        url: '/shortlist',
        templateUrl: 'app/shortlist/shortlist.html'
        // controller: 'CartCtrl'
      });
  });
