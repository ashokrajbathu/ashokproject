'use strict';

angular.module('shopnxApp')
  .controller('ProfileCtrl', function ($scope, User, Auth, Product) {
    $scope.errors = {};

    $scope.getCurrentUser = Auth.getCurrentUser;

      var id = $scope.getCurrentUser.id;
      console.log($scope.getCurrentUser.id);
    // var slug = $stateParams.slug;
    // Storing the product id into localStorage because the _id of the selected product which was passed as a hidden parameter from products won't available on page refresh

        var productId = 'alekhyamenni@gmail.com';
    

    $scope.product = Product.get({tecid:productId},function(data) {
      
    });

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};
  });

