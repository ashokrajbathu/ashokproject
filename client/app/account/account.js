'use strict';

angular.module('shopnxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        title: 'Login to ',
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('Profile', {
        title: 'Profile ',
        url: '/profile',
        templateUrl: 'app/account/profile/profile.html',
        controller: 'ProfileCtrl'
      })
      .state('signup', {
        title: 'Signup for ',
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('signupemp', {
        title: 'Signup for Employer ',
        url: '/signupemp',
        templateUrl: 'app/account/signup/signupemp.html',
        controller: 'SignupEmpCtrl'
      })
      .state('settings', {
        title: 'Settings - Change Password ',
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
  });
