'use strict';

angular.module('shopnxApp', [
  'ngCookies',
  'ngResource',
  'ngAnimate',
  'toastr',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'tableSort',
  'checklist-model',
  'rzModule',
  'infinite-scroll',
  'darthwade.dwLoading',
  'angularMoment',
  'ui.select'
])
  .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  }])

  .factory('authInterceptor', ["$rootScope", "$q", "$cookieStore", "$location", function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  }])

  .run(["$rootScope", "Auth", "$state", function ($rootScope, Auth, $state) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          Auth.saveAttemptUrl();
          $state.go('login');
        }
      });
    });

    $rootScope.$on('$stateChangeSuccess', function (evt, toState) {
        window.document.title = toState.title + ' - Websoc';
    });

    $rootScope.spinner = {
      active: false,
      on: function () {
        this.active = true;
      },
      off: function () {
        this.active = false;
      }
    };
  }]);

  // .run(run);
  // run.$inject = ['$rootScope'];
  // function run ($rootScope) { // The function to display a loading spinner on ajax request
  //
  // }

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('login', {
        title: 'Login to ',
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        title: 'Signup for ',
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('settings', {
        title: 'Settings - Change Password ',
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('LoginCtrl', ["$scope", "Auth", "$location", "$window", function ($scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to the page with requested a login
          Auth.redirectToAttemptedUrl();
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('SettingsCtrl', ["$scope", "User", "Auth", function ($scope, User, Auth) {
    $scope.errors = {};

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
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('SignupCtrl', ["$scope", "Auth", "$location", "$window", function ($scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Account created, redirect to the page with requested a signup
          Auth.redirectToAttemptedUrl();
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('AdminCtrl', ["$scope", "PaymentMethods", "Setting", "toastr", function ($scope, PaymentMethods, Setting, toastr) {

    $scope.errors = {};
    $scope.settings = {};
    PaymentMethods.query({},function(res){
      $scope.payment = res[0];
    });
    // Shipping
    Setting.query({},function(res){
      $scope.settings = res[0];
    });
    $scope.saveSettings = function(settings) {
      $scope.submitted = true;
      if(settings._id) {
          Setting.update({ id:settings._id }, settings).$promise.then(function(res) {
            $scope.message = 'Shipping settings saved successfully.';
          }, function(error) { // error handler
            console.log(error);
            if(error.data.errors){
              var err = error.data.errors;
              toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
            }
            else{
              var msg = error.data.message;
              toastr.error(msg);
            }
          });
      }
		};
    // $scope.savePaypal = function(settings) {
    //   $scope.submitted = true;
    //   if(settings._id) {
    //       Setting.update({ id:settings._id }, settings).$promise.then(function(res) {
    //         $scope.message = 'Payment Method saved successfully.';
    //       }, function(error) { // error handler
    //         console.log(error);
    //         settings.paypal.$setValidity('mongoose', false);
    //         $scope.errors.other = 'Incorrect payment method';
    //         $scope.message = '';
    //         if(error.data.errors){
    //           var err = error.data.errors;
    //           toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
    //         }
    //         else{
    //           var msg = error.data.message;
    //           toastr.error(msg);
    //         }
    //       });
    //   }
		// };
  }]);

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('admin', {
        title: 'Shop Settings - Payment Option ',
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl',
        authenticate: true
      });
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('BrandCtrl', function () {

  });

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('brand', {
        title: 'Add, Remove, Edit Brands',
        url: '/brand',
        templateUrl: 'app/brand/brand.html',
        controller: 'BrandCtrl',
        authenticate: true
      });
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('CartCtrl',function () {

  });

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('cart', {
        title: 'Details of items in your shopping cart',
        url: '/cart',
        templateUrl: 'app/cart/cart.html'
        // controller: 'CartCtrl'
      });
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('CategoryCtrl', function () { //, socket, Category, Modal, toastr

  });

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('category', {
        title: 'Add, Remove, Edit categories',
        url: '/category',
        templateUrl: 'app/category/category.html',
        controller: 'CategoryCtrl',
        authenticate: true
      });
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('CheckoutCtrl', ["$scope", "Order", "PaymentMethod", "Shipping", "Coupon", "Country", function ($scope, Order, PaymentMethod, Shipping, Coupon, Country) {
      $scope.msg = 'No items in cart.';
      $scope.customer = {};
      $scope.coupon = {};

      Country.query().$promise.then(function(res){
        $scope.countries = res;
      });

      PaymentMethod.active.query().$promise.then(function(res){
        $scope.paymentMethods = res;
        $scope.customer.paymentMethod = res[0];
      });

      Shipping.best.query({},function(res){
        $scope.shipping = res[0];
      });

      $scope.calculateShipping = function(country){
        Shipping.best.query({country:country.name},function(res){
          console.log(res);
          $scope.shipping = res[0];
        });
      };

      $scope.placeOrder = function(cart){
        var data = {phone:$scope.customer.phone, name:$scope.customer.name, address:$scope.customer.address, city:$scope.customer.city, payment:'Pending', items:cart};
        Order.save(data);
        $scope.msg = 'Processing Payment ...';
      };

      $scope.removeCoupon = function(){
        $scope.coupon = {};
      };
      $scope.checkCoupon = function(code, cartValue){
        var x = {};
        // x.where is required else it adds unneccessery colons which can not be parsed by the JSON parser at the Server
        x.where = {code:code,active:true,'minimumCartValue' : { $lte: cartValue } };

        Coupon.query(x, function(res){
          $scope.coupon = res[0];
        });

      };
  }]);

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('checkout', {
        title: 'Checkout with the items you selected',
        url: '/checkout',
        templateUrl: 'app/checkout/checkout.html',
        controller: 'CheckoutCtrl',
        authenticate: true
      });
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('ContactCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('contact', {
        title: 'Contact Information',
        url: '/contact',
        templateUrl: 'app/contact/contact.html',
        controller: 'ContactCtrl'
      });
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('CouponCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('coupon', {
        title: 'Manage your shop coupons',
        url: '/coupon',
        templateUrl: 'app/coupon/coupon.html',
        controller: 'CouponCtrl'
      });
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('CustomerCtrl', function () {

  });

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('customer', {
        title: 'Customers Details',
        url: '/customer',
        templateUrl: 'app/customer/customer.html',
        controller: 'CustomerCtrl',
        authenticate: true
      });
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('DashboardCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardCtrl'
      });
  }]);

'use strict';

angular.module('shopnxApp')

  .directive('crudTable',['Modal','$injector','$loading','socket','toastr', function (Modal,$injector,$loading,socket,toastr) {
    return {
      templateUrl: 'app/directive/table.html',
      restrict: 'EA',
      scope: {obj:'='},
      link: function (scope, element, attrs) {
        // var cols = ['name','info','parent','image'];
        scope.title = attrs.api+'s';
        var cols = JSON.parse(attrs.cols);
        var obj = [];
        scope.noedit = attrs.noedit;
        scope.nodelete = attrs.nodelete;
        scope.noadd = attrs.noadd;
        // console.log();
        // scope.disabledColumn = attrs.disabledcolumn;
        angular.forEach(cols, function(o) {
          // var k,v;
          angular.forEach(o, function(v, k) {
            var v1;
            if(v==='number' || v==='float' || v==='integer' || v==='currency'){ v1 = 'parseFloat';}
            else{ v1 = 'lowercase';}
            obj.push({heading:k,dataType:v, sortType:v1});
          });
        });
        scope.cols = obj;
        // scope.Utils = {
        //    keys : Object.keys,
        //    values : Object.values
        // }
        var api = $injector.get(attrs.api);
        scope.data = [];
        // scope.loadingTable = true;
        $loading.start('crudTable');
        scope.data =api.query(function() {
          // scope.loadingTable = false;
          $loading.finish('crudTable');
          socket.syncUpdates(attrs.api.toLowerCase(), scope.data);
        });
        scope.edit = function(item) {
          var title; if(item._id){ title = 'Editing ' + item._id;} else{ title = 'Add New';}
          Modal.show(item,{title:title, api:attrs.api, columns: obj, disabledColumn: attrs.disabledcolumn});
        };
        scope.changeActive = function(b){ // success handler
          b.active = !b.active;
          api.update({ id:b._id }, b).$promise.then(function() {

          }, function(error) { // error handler
              console.log(error);
              toastr.error(error.statusText + ' (' +  error.status + ')');
              b.active = !b.active;
          });
        };

        scope.delete = function(item) {
          api.delete({id:item._id});
        };

        scope.$on('$destroy', function () {
          socket.unsyncUpdates(attrs.api.toLowerCase());
        });
      }
    };}])

.directive('modalWindow', ['$timeout', function ($timeout) {
  return {
    priority: 1,
    link: function (scope, element) {
      $timeout(function () {
        // var elem = element[0].querySelector('[autofocus]').focus();
        var elem = element[0].querySelector('input');
        if(elem){
          elem.focus();
        }
      });
    }
  };
}])

// .directive('checkCoupon',function(Coupon) {
//     return {
//         require: 'ngModel',
//         link: function(scope, element, attrs, ctrl) {
//             scope.$watch(attrs.ngModel, function (val) {
//             console.log(val);
//               if(val){
//               // ctrl.$setValidity('phoneLoading', false);
//               Coupon.get({id:val}, function (data) {
//                 if(data){
//                   var customer = data.data[0];
//                   scope.customer.name = customer.name;
//                   scope.customer.email = customer.email;
//                   scope.customer.address = customer.address;
//                   scope.customer.city = customer.city;
//                   ctrl.$setValidity('isCustomer', true);
//                 }else{
//                   ctrl.$setValidity('isCustomer', false);
//                 }
//               });
//             }else{
//                   ctrl.$setValidity('isCustomer', false);
//                   scope.customer = '';
//             }
//           });
//         }
//     };
//
// })

// .directive('autoFillCustomer',function(Customer) {
//     return {
//         require: 'ngModel',
//         link: function(scope, element, attrs,ctrl) {
//             scope.$watch(attrs.ngModel, function (val) {
//                 if(val){
//                 // ctrl.$setValidity('phoneLoading', false);
//                 Customer.findOne({filter:{where:{phone:val}}}).then(function (data) {
//                   if(data){
//                     var customer = data.data[0];
//                     scope.customer.name = customer.name;
//                     scope.customer.email = customer.email;
//                     scope.customer.address = customer.address;
//                     scope.customer.city = customer.city;
//                     ctrl.$setValidity('isCustomer', true);
//                   }else{
//                     ctrl.$setValidity('isCustomer', false);
//                   }
//                 });
//               }else{
//                     ctrl.$setValidity('isCustomer', false);
//                     scope.customer = '';
//               }
//             });
//         }
//     };
//
// })

.directive('sortableColumns', [function () {
    return {
        restrict:'A',
        replace:true,
        templateUrl:'views/sortable-columns.tpl.html',
        scope:{
            columns:'=',
            itemsToSort:'='
        },
        link:function(scope){
            scope.columnClicked = function(column){
                    if(scope.columns.columnToSort.predicate === column.predicate){
                        scope.columns.columnToSort.reverse = !scope.columns.columnToSort.reverse;
                    }else{
                        scope.columns.columnToSort = column;
                    }
                    scope.sortBy(scope.columns.columnToSort);
            };

            scope.sortBy = function(column){
              console.log(column);
                scope.itemsToSort = _.sortBy(scope.itemsToSort,function(obj){
                    switch (column.dataType){
                        case 'number':
                            return Number(obj[column.predicate]);
                        case 'date':
                            return new Date(obj[column.predicate]);
                        default:
                            return obj[column.predicate].toString();
                    }
                });

                if(column.reverse){
                    scope.itemsToSort = scope.itemsToSort.reverse();
                }
            };
            scope.columns.columnToSort = scope.columns[1];
            scope.sortBy(scope.columns.columnToSort);
        }
    };

}])
// .directive('formElement', function() {
//     return {
//         restrict: 'E',
//         transclude: true,
//         scope: {
//             label : '@',
//             model : '='
//         },
//         link: function(scope, element, attrs) {
//             scope.disabled = attrs.hasOwnProperty('disabled');
//             scope.required = attrs.hasOwnProperty('required');
//             scope.pattern = attrs.pattern || '.*';
//         },
//         template: '<div class="form-group"><label class="col-sm-3 control-label no-padding-right" >  {{label}}</label><div class="col-sm-7"><span class="block input-icon input-icon-right" ng-transclude></span></div></div>'
//       };
//
// })

.directive('onlyNumbers', function() {
    return function(scope, element, attrs) {
        var keyCode = [8,9,13,37,39,46,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110,190];
        element.bind('keydown', function(event) {
            if($.inArray(event.which,keyCode) === -1) {
                scope.$apply(function(){
                    scope.$eval(attrs.onlyNum);
                    event.preventDefault();
                });
                event.preventDefault();
            }

        });
    };
})

// .directive('animateOnChange', function($animate) {
//   return function(scope, elem, attr) {
//       scope.$watch(attr.animateOnChange, function(nv,ov) {
//         if (nv!==ov) {
//               var c = 'change-up';
//               $animate.addClass(elem,c, function() {
//               $animate.removeClass(elem,c);
//           });
//         }
//       });
//   };
// })

.directive('passwordMatch', [function () {
    return {
        restrict: 'A',
        scope:true,
        require: 'ngModel',
        link: function (scope, elem , attrs,control) {
            var checker = function () {

                //get the value of the first password
                var e1 = scope.$eval(attrs.ngModel);

                //get the value of the other password
                var e2 = scope.$eval(attrs.passwordMatch);
                if(e2!==null){
                  return e1 === e2;
                }
            };
            scope.$watch(checker, function (n) {

                //set the form control to valid if both
                //passwords are the same, else invalid
                control.$setValidity('passwordNoMatch', n);
            });
        }
    };
}])
.directive('ngConfirmClick', ['$modal',
    function($modal) {

      var ModalInstanceCtrl = function($scope, $modalInstance) {
        $scope.ok = function() {
          $modalInstance.close();
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };
      };
      ModalInstanceCtrl.$inject = ["$scope", "$modalInstance"];

      return {
        restrict: 'A',
        scope:{
          ngConfirmClick:'&',
          item:'='
        },
        link: function(scope, element, attrs) {
          element.bind('click', function() {
            var message = attrs.ngConfirmMessage || 'Are you sure to delete? ';

            /*
            //This works
            if (message && confirm(message)) {
              scope.$apply(attrs.ngConfirmClick);
            }
            //*/

            //*This doesn't works

            var modalHtml = '<div class="modal-header">Confirm Delete</div>';
            modalHtml += '<div class="modal-body">' + message + '</div>';
            modalHtml += '<div class="modal-footer"><button class="btn btn-danger" ng-click="ok()">Delete</button><button class="btn" ng-click="cancel()">Cancel</button></div>';

            var modalInstance = $modal.open({
              template: modalHtml,
              controller: ModalInstanceCtrl,
              windowClass: 'modal-danger'
            });

            modalInstance.result.then(function() {
              scope.ngConfirmClick({item:scope.item}); //raise an error : $digest already in progress
            }, function() {
              //Modal dismissed
            });
            //*/

          });

        }
      };
    }
  ])
  .directive('errSrc', [function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src !== attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  };
}]);

'use strict';

angular.module('shopnxApp')
  .controller('DocumentationCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('documentation', {
        title: 'Documentation',
        url: '/documentation',
        templateUrl: 'app/documentation/documentation.html',
        controller: 'DocumentationCtrl'
      });
  }]);

'use strict';

  function ShoppingCart(cartName) {
      this.cartName = cartName;
      this.clearCart = false;
      this.checkoutParameters = {};
      this.items = [];
      this.skuArray = [];
      // load items from local storage when initializing
      this.loadItems();
  }

    //----------------------------------------------------------------
    // items in the cart
    //
    function CartItem(sku, name, slug, mrp, price, quantity, image, category, packing) {
        this.sku = sku;
        this.name = name;
        this.slug = slug;
        this.image = image;
        this.category = category;
        this.packing = packing;
        this.mrp = mrp;
        this.price = price * 1;
        this.quantity = quantity * 1;
        this.status = 0;
    }

    //----------------------------------------------------------------
    // checkout parameters (one per supported payment service)
    // replaced this.serviceName with serviceName because of jshint complaint
    //
    function checkoutParameters(serviceName, merchantID, options) {
        this.serviceName = serviceName;
        this.merchantID = merchantID;
        this.options = options;
    }

  // load items from local storage
  ShoppingCart.prototype.loadItems = function () {
      var items = localStorage !== null ? localStorage[this.cartName + '_items'] : null;
      if (items !== null && JSON !== null) {
          try {
              items = JSON.parse(items);
              for (var i = 0; i < items.length; i++) {
                  var item = items[i];
                  if (item.sku !== null && item.name !== null && item.price !== null) {
                      item = new CartItem(item.sku, item.name, item.slug, item.mrp, item.price, item.quantity, item.image, item.category, item.packing, item.status);
                      this.items.push(item);
                      this.skuArray.push(item.sku);
                  }
              }

          }
          catch (err) {
              // ignore errors while loading...
          }
      }
  };

  // save items to local storage
  ShoppingCart.prototype.saveItems = function () {
      if (localStorage !== null && JSON !== null) {
          localStorage[this.cartName + '_items'] = JSON.stringify(this.items);
      }
  };

  // adds an item to the cart
  ShoppingCart.prototype.addItem = function (sku, name, slug, mrp, price, quantity, image, category, packing) {
      quantity = this.toNumber(quantity);
      if (quantity !== 0) {
          // update quantity for existing item
          var found = false;
          for (var i = 0; i < this.items.length && !found; i++) {
              var item = this.items[i];
              if (item.sku === sku) {
                  found = true;
                  item.quantity = this.toNumber(this.toNumber(item.quantity) + quantity);
                  if (item.quantity <= 0) {
                      this.items.splice(i, 1);
                      this.skuArray.splice(i,1);
                  }
              }
          }

          // new item, add now
          if (!found) {
              var itm = new CartItem(sku, name, slug, mrp, price, quantity, image, category, packing, 0);
              this.items.push(itm);
              this.skuArray.push(itm.sku);
          }

          // save changes
          this.saveItems();
      }
  };

  // get the total price for all items currently in the cart
  ShoppingCart.prototype.getTotalPrice = function (sku) {
      var total = 0;
      for (var i = 0; i < this.items.length; i++) {
          var item = this.items[i];
          if (sku === undefined || item.sku === sku) {
              total += this.toNumber(item.quantity * item.price);
          }
      }
      return total;
  };

  ShoppingCart.prototype.getTotalPriceAfterShipping = function () { //Total Price Including Shipping
      var total = 0;
      total = this.getTotalPrice() ;
      if(total<500){
        total+=20;
      }
      return total;
  };

  // get the total price for all items currently in the cart
  ShoppingCart.prototype.getTotalCount = function (sku) {
      var count = 0;
      for (var i = 0; i < this.items.length; i++) {
          var item = this.items[i];
          if (sku === undefined || item.sku === sku) {
              count += this.toNumber(item.quantity);
          }
      }
      return count;
  };

  // clear the cart
  ShoppingCart.prototype.clearItems = function () {
      this.items = [];
      this.skuArray = [];
      this.saveItems();
  };

  ShoppingCart.prototype.toNumber = function (value) {
      value = value * 1;
      return isNaN(value) ? 0 : value;
  };

  // define checkout parameters
ShoppingCart.prototype.addCheckoutParameters = function (serviceName, merchantID, options) {

    // check parameters
    if (serviceName != "PayPal" && serviceName != "Google" && serviceName != "Stripe" && serviceName != "COD") {
        throw "serviceName must be 'PayPal' or 'Google' or 'Stripe' or 'Cash On Delivery'.";
    }
    if (merchantID == null) {
        throw "A merchantID is required in order to checkout.";
    }

    // save parameters
    this.checkoutParameters[serviceName] = new checkoutParameters(serviceName, merchantID, options);
}

// check out
ShoppingCart.prototype.checkout = function (serviceName, clearCart) {
  this.addCheckoutParameters(serviceName.name, serviceName.email, serviceName.options);

  // this.addCheckoutParameters("COD", "-");
  // // enable PayPal checkout
  // // note: the second parameter identifies the merchant; in order to use the
  // // shopping cart with PayPal, you have to create a merchant account with
  // // PayPal. You can do that here:
  // // https://www.paypal.com/webapps/mpp/merchant
  // this.addCheckoutParameters("PayPal", "2lessons@gmail.com");
  //
  // // enable Google Wallet checkout
  // // note: the second parameter identifies the merchant; in order to use the
  // // shopping cart with Google Wallet, you have to create a merchant account with
  // // Google. You can do that here:
  // // https://developers.google.com/commerce/wallet/digital/training/getting-started/merchant-setup
  // this.addCheckoutParameters("Google", "2lessons@gmail.com",
  //     {
  //         ship_method_name_1: "UPS Next Day Air",
  //         ship_method_price_1: "20.00",
  //         ship_method_currency_1: "USD",
  //         ship_method_name_2: "UPS Ground",
  //         ship_method_price_2: "15.00",
  //         ship_method_currency_2: "USD"
  //     }
  // );
  //
  // // enable Stripe checkout
  // // note: the second parameter identifies your publishable key; in order to use the
  // // shopping cart with Stripe, you have to create a merchant account with
  // // Stripe. You can do that here:
  // // https://manage.stripe.com/register
  // this.addCheckoutParameters("Stripe", "pk_test_srKHaSHynBIVLX03r33xLszb",
  //     {
  //         chargeurl: "http://biri.in/order"
  //     }
  // );

// console.log(serviceName);
    // select serviceName if we have to
    if (serviceName.name == null) {
        var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
        serviceName = p.serviceName;
    }

    // sanity
    if (serviceName.name == null) {
        throw "Use the 'addCheckoutParameters' method to define at least one checkout service.";
    }

    // go to work
    var parms = this.checkoutParameters[serviceName.name];
// console.log(parms);
    if (parms == null) {
        throw "Cannot get checkout parameters for '" + serviceName.name + "'.";
    }
    switch (parms.serviceName) {
        case "PayPal":
            this.checkoutPayPal(parms, clearCart);
            break;
        case "Google":
            this.checkoutGoogle(parms, clearCart);
            break;
        case "Stripe":
            this.checkoutStripe(parms, clearCart);
            break;
        case "COD":
            this.checkoutCOD(parms, clearCart);
            break;
        default:
            throw "Unknown checkout service: " + parms.serviceName;
    }
}

// check out using PayPal
// for details see:
// www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside
ShoppingCart.prototype.checkoutPayPal = function (parms, clearCart) {

    // global data
    var data = {
        cmd: "_cart",
        business: parms.merchantID,
        upload: "1",
        rm: "2",
        charset: "utf-8"
    };

    // item data
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var ctr = i + 1;
        data["item_number_" + ctr] = item.sku;
        data["item_name_" + ctr] = item.name;
        data["quantity_" + ctr] = item.quantity;
        data["amount_" + ctr] = item.price.toFixed(2);
    }

    // build form
    var form = $('<form/></form>');
    form.attr("action", "https://www.paypal.com/cgi-bin/webscr");
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    if(!parms.options){parms.options = {};}
    this.addFormFields(form, parms.options);
    $("body").append(form);

    // submit form
    this.clearCart = clearCart == null || clearCart;
    form.submit();
    form.remove();
}

// check out using Google Wallet
// for details see:
// developers.google.com/checkout/developer/Google_Checkout_Custom_Cart_How_To_HTML
// developers.google.com/checkout/developer/interactive_demo
ShoppingCart.prototype.checkoutGoogle = function (parms, clearCart) {

    // global data
    var data = {};

    // item data
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var ctr = i + 1;
        data["item_name_" + ctr] = item.sku;
        data["item_description_" + ctr] = item.name;
        data["item_price_" + ctr] = item.price.toFixed(2);
        data["item_quantity_" + ctr] = item.quantity;
        data["item_merchant_id_" + ctr] = parms.merchantID;
    }

    // build form
    var form = $('<form/></form>');
    // NOTE: in production projects, use the checkout.google url below;
    // for debugging/testing, use the sandbox.google url instead.
    //form.attr("action", "https://checkout.google.com/api/checkout/v2/merchantCheckoutForm/Merchant/" + parms.merchantID);
    form.attr("action", "https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/" + parms.merchantID);
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    if(!parms.options){parms.options = {};}
    this.addFormFields(form, parms.options);
    $("body").append(form);

    // submit form
    this.clearCart = clearCart == null || clearCart;
    form.submit();
    form.remove();
}

// check out using COD
ShoppingCart.prototype.checkoutCOD = function (parms, clearCart) {

      // global data
      var data = {};

      // item data
      for (var i = 0; i < this.items.length; i++) {
          var item = this.items[i];
          var ctr = i + 1;
          // data["item_name_" + ctr] = item.sku;
          data["item_description_" + ctr] = item.name;
          // data["item_price_" + ctr] = item.price.toFixed(2);
          // data["item_quantity_" + ctr] = item.quantity;
          // data["item_merchant_id_" + ctr] = parms.merchantID;
      }

      // build form
      var form = $('<form/></form>');
      // NOTE: in production projects, use the checkout.google url below;
      // for debugging/testing, use the sandbox.google url instead.
      //form.attr("action", "https://checkout.google.com/api/checkout/v2/merchantCheckoutForm/Merchant/" + parms.merchantID);
      form.attr("action", "/order");
      form.attr("method", "GET");
      form.attr("style", "display:none;");
      this.addFormFields(form, data);
      if(!parms.options){parms.options = {};}
      this.addFormFields(form, parms.options);
      $("body").append(form);

      // submit form
      this.clearCart = clearCart == null || clearCart;
      form.submit();
      form.remove();
}

// check out using Stripe
// for details see:
// https://stripe.com/docs/checkout
ShoppingCart.prototype.checkoutStripe = function (parms, clearCart) {

    // global data
    var data = {};

    // item data
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var ctr = i + 1;
        data["item_name_" + ctr] = item.sku;
        data["item_description_" + ctr] = item.name;
        data["item_price_" + ctr] = item.price.toFixed(2);
        data["item_quantity_" + ctr] = item.quantity;
    }

    // build form
    var form = $('.form-stripe');
    form.empty();
    // NOTE: in production projects, you have to handle the post with a few simple calls to the Stripe API.
    // See https://stripe.com/docs/checkout
    // You'll get a POST to the address below w/ a stripeToken.
    // First, you have to initialize the Stripe API w/ your public/private keys.
    // You then call Customer.create() w/ the stripeToken and your email address.
    // Then you call Charge.create() w/ the customer ID from the previous call and your charge amount.
    form.attr("action", parms.options['chargeurl']);
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    if(!parms.options){parms.options = {};}
    this.addFormFields(form, parms.options);
    $("body").append(form);

    // ajaxify form
    // form.ajaxForm({
    //     success: function () {
    //         $.unblockUI();
    //         alert('Thanks for your order!');
    //     },
    //     error: function (result) {
    //         $.unblockUI();
    //         alert('Error submitting order: ' + result.statusText);
    //     }
    // });

    var token = function (res) {
        var $input = $('<input type=hidden name=stripeToken />').val(res.id);

        // show processing message and block UI until form is submitted and returns
        $.blockUI({ message: 'Processing order...' });

        // submit form
        form.append($input).submit();
        this.clearCart = clearCart == null || clearCart;
        form.submit();
    };

    StripeCheckout.open({
        key: parms.merchantID,
        address: false,
        amount: this.getTotalPrice() *100, /** expects an integer **/
        currency: 'usd',
        name: 'Purchase',
        description: 'Description',
        panelLabel: 'Checkout',
        token: token
    });
}

  // utility methods
  ShoppingCart.prototype.addFormFields = function (form, data) {
      if (data !== null) {
          $.each(data, function (name, value) {
              if (value !== null) {
                  var input = $('<input></input>').attr('type', 'hidden').attr('name', name).val(value);
                  form.append(input);
              }
          });
      }
  };

  angular.module('shopnxApp')
    .factory('Cart', ["Setting", "$location", function (Setting, $location) {
      var myCart = new ShoppingCart('ShopNx');

      // var settings = Setting.query().$promise.then(function(res){
      //     myCart.addCheckoutParameters('PayPal', res[0].paypal);
      // }, function (err) {
      //     console.log("fail", err);
      // });
      // console.log(myCart);
      return { cart: myCart };
    }]);

'use strict';

angular.module('shopnxApp')
// Sample factory (dummy)
  .factory('factory', [function () {
    var somValue = 42;
    return {
      someMethod: function () {
        return somValue;
      }
    };
  }])
  .factory('Product', ['$resource', function($resource) {
    var obj = {};
    obj = $resource('/api/products/:id', null, {'update': { method:'PUT' } });
    obj.count = $resource('/api/products/count', null, {'update': { method:'PUT' }});
    return obj;
  }])

  .factory('Shipping', ['$resource', function($resource) {
    var obj = {};
    obj = $resource('/api/shippings/:id', null, {'update': { method:'PUT' } });
    obj.best = $resource('/api/shippings/best', null, {'update': { method:'PUT' }});
    return obj;
  }])

  .factory('SortOptions', [function() {
    var obj = {};
    obj.server= [
       {name:'Low Percentage', val:{'variants.price':1}},
       {name:'Hign Percentage', val:{'variants.price':-1}},
       {name:'Name (A-Z)', val:{'name':1}},
       {name:'Name (Z-A)', val:{'name':-1}}
    ];
    obj.client= [
       {name:'Price Asc', val:'variants[0].price'},
       {name:'Price Desc', val:'-variants[0].price'},
       {name:'Name Asc', val:'name'},
       {name:'Name Desc', val:'-name'}
    ];
    return obj;
  }])

  .factory('Category', ['$resource', function($resource) {
    var obj = {};
    obj = $resource('/api/category/:id', null, {'update': { method:'PUT' }});
    obj.parent = $resource('/api/category/parent/:id', null, {'update': { method:'PUT' }});
    obj.all = $resource('/api/category/all', null, {'update': { method:'PUT' }});
    return obj;
  }])
  .factory('Country', ['$resource', function($resource) {
    return $resource('/api/countries/:id', null, {'update': { method:'PUT' } });
  }])
  .factory('Brand', ['$resource', function($resource) {
    return $resource('/api/brands/:id', null, {'update': { method:'PUT' } });
  }])
  .factory('Coupon', ['$resource', function($resource) {
    return $resource('/api/coupons/:id', null, {'update': { method:'PUT' } });
  }])
  // .factory('Shipping', ['$resource', function($resource) {
  //   return $resource('/api/shippings/:id', null, {'update': { method:'PUT' } });
  // }])
  .factory('Feature', ['$resource', function($resource) {
    var obj = {};
    obj = $resource('/api/features/:id', null, {'update': { method:'PUT' } });
    obj.group = $resource('/api/features/group', null, {'update': { method:'PUT' }});
    return obj;
  }])
  .factory('PaymentMethod', ['$resource', function($resource) {
    var obj = {};
    obj = $resource('/api/PaymentMethods/:id', null, {'update': { method:'PUT' } });
    obj.active = $resource('/api/PaymentMethods/active', null, {'update': { method:'PUT' }});
    return obj;
  }])
  .factory('Customer', ['$resource', function($resource) {
    return $resource('/api/customers/:id', null, {'update': { method:'PUT' } });
  }])
  .factory('Setting', ['$resource', function($resource) {
    return $resource('/api/settings/:id', null, {'update': { method:'PUT' } });
  }])
  .factory('Order', ['$resource', function($resource) {
    var obj = {};
    obj = $resource('/api/orders/:id', null, {'update': { method:'PUT' } });
    obj.my = $resource('/api/orders/my', null, {'update': { method:'PUT' }});
    obj.status = [
      {name:'Pending Payment', val:402},
      {name:'Order Placed', val:201},
      {name:'Order Accepted', val:202},
      {name:'Order Executed', val:302},
      {name:'Shipped', val:200},
      {name:'Delivered', val:200},
      {name:'Cancelled', val:204},
      {name:'Not in Stock', val:404}
    ];
    return obj;
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('FeatureCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('feature', {
        url: '/feature',
        templateUrl: 'app/feature/feature.html',
        controller: 'FeatureCtrl'
      });
  }]);
'use strict';

angular.module('shopnxApp')
  .filter('unique', function() {
      return function(input, key) {
          var unique = {};
          var uniqueList = [];
          for(var i = 0; i < input.length; i++){
              if(typeof unique[input[i][key]] == "undefined"){
                  unique[input[i][key]] = "";
                  uniqueList.push(input[i]);
              }
          }
          return uniqueList;
      };
  })
  .filter('labelCase', [function(){
      return function(input){
        if(!input){
          return input;
        }else{
          input = input.replace(/([A-Z])/g, ' $1');
          return input[0].toUpperCase() + input.slice(1);
        }
      };
  }])
  .filter('camelCase', [function(){
    return function(input){
      if(!input){
        return input;
      }else{
        return input.toLowerCase().replace(/ (\w)/g, function(match, letter){
          return letter.toUpperCase();
        });
      }
    };
  }])

  .filter('reverse', [function() {
    return function(items) {
      if(items){
        return items.slice().reverse();
      }else{
        return items;
      }
    };
  }])

  .filter('active', [function() {
      return function(input) {
          // console.log(input);
        var out = 'I';
        if(input===true){ out='A';}
        return out;
      };
  }])

  .filter('status', [function() {
      return function(input) {
          console.log(input);
        var out = 'I';
        if(input==='0'){ out='A';}
        return out;
      };
  }])
  .filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
           console.log(item[prop]);
          if(item[prop]==null)
            return;
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  }
});

'use strict';

angular.module('shopnxApp')
  .controller('InventoryCtrl', ["$scope", "socket", "Product", "Modal", function ($scope, socket, Product, Modal) {
    $scope.products = [];

    $scope.products =
    Product.query(function() {
      socket.syncUpdates('product', $scope.products);
    });

    $scope.addProduct = function() {
      if($scope.product === ''){
        return;
      }
      Product.save($scope.product);
      $scope.product = {};
    };

    $scope.editProduct = function(product) {
      Modal.show(product,{title:product.name});
    };

    $scope.deleteProduct = Modal.delete(function(product) {
      Product.delete({id:product._id});
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('product');
    });

  }]);

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('inventory', {
        url: '/inventory',
        templateUrl: 'app/inventory/inventory.html',
        controller: 'InventoryCtrl'
      });
  }]);
'use strict';

angular.module('shopnxApp')
  .controller('InvoiceCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('invoice', {
        url: '/invoice',
        templateUrl: 'app/invoice/invoice.html',
        controller: 'InvoiceCtrl',
        authenticate: true
      });
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('ProductDetailsCtrl', ["$scope", "$rootScope", "Product", "Category", "socket", "$stateParams", "$location", "$state", "$injector", function ($scope, $rootScope, Product, Category, socket, $stateParams, $location, $state, $injector) {
    var id = $stateParams.id;
    // var slug = $stateParams.slug;
    // Storing the product id into localStorage because the _id of the selected product which was passed as a hidden parameter from products won't available on page refresh
    if (localStorage !== null && JSON !== null && id !== null) {
        localStorage.productId = id;
    }
    var productId = localStorage !== null ? localStorage.productId : null;

    $scope.product = Product.get({id:productId},function(data) {
      socket.syncUpdates('product', $scope.data);
      generateBreadCrumb('Category',data.category._id);
    });
    $scope.categories = Category.all.query();
    // To shuffle throught different product variants
    $scope.i=0;
    $scope.changeIndex =function(i){
        $scope.i=i;
    };

    // The main function to navigate to a page with some hidden parameters
    $scope.navigate = function(page,params){
      if(params){
        $location.replace().path(page+'/'+params.slug+'/'+params._id);
      }else{
        $location.replace().path('/');
      }
    };

    // Function to generate breadcrumb for category and brand
    // Future: Put it inside a directive
    var generateBreadCrumb = function(page, id){
      $scope.breadcrumb = {};
      $scope.breadcrumb.items = [];
      var api = $injector.get(page);
      api.get({id:id}).$promise.then(function(child){
        $scope.breadcrumb.items.push(child);
        // var p = child.parent;
        // if(p != null){findBrandPath(1);}
        if(page==='Category'){
          $scope.breadcrumb.items.push({name:'All Categories'});
        }
        else if(page==='Brand'){
          $scope.breadcrumb.items.push({name:'All Brands'});
        }
      });
    };

  }])

  .controller('MainCtrl', ["$scope", "$state", "$stateParams", "$location", "Product", "Brand", "Category", "Feature", "socket", "$rootScope", "$injector", "$loading", function ($scope, $state, $stateParams, $location, Product, Brand, Category, Feature, socket, $rootScope, $injector, $loading) {

    if ($stateParams.productSku) { // != null
        $scope.product = $scope.store.getProduct($stateParams.productSku);
    }




// For Price slider
    $scope.currencyFormatting = function(value){
      return  '$ ' + value.toString();
    };

    $scope.removeBrand = function(brand){
      var index = $scope.fl.brands.indexOf(brand);
      if (index > -1) {
          $scope.fl.brands.splice(index, 1);
          $scope.filter();
      }
    }

    $scope.removeFeatures = function(feature){
      console.log($scope.fl.features,feature);
      // var index = $scope.fl.features.indexOf(feature);
      // if (index > -1) {
      //     $scope.fl.features.splice(index, 1);
      //     $scope.filter();
      // }
    }

    $scope.removeCategory = function(){
      console.log('cat');
      $scope.fl.categories = undefined;
      $scope.filter();
    }

    $scope.products = {};
    $scope.filtered = {};
    $scope.products.busy = false;
    $scope.products.end = false;
    $scope.products.after = 0;
    $scope.products.items = [];
    // $scope.products.sort = sortOptions[0].val;
    $scope.fl = {};
    $scope.fl.brands = [];
    $scope.fl.categories = [];
    $scope.priceSlider = {};
    $scope.features = Feature.group.query();
    $scope.navigate = function(page,params){
      // var params = params.delete('$$hashKey');
      if(page==='sort'){
        delete params.$$hashKey;
        var paramString = JSON.stringify(params);
        // console.log(paramString);
        $state.go($state.current, {sort: paramString}, {reload: true});
      }
      else if(params){
        $location.replace().path(page+'/'+params.slug+'/'+params._id);
      }else{
        $location.replace().path('/');
      }
    };
    var generateBreadCrumb = function(page, id){
      $scope.breadcrumb.items = [];
      var api = $injector.get(page);
      api.get({id:id}).$promise.then(function(child){
        $scope.breadcrumb.items.push(child);
        // var p = child.parent;
        // if(p != null){findBrandPath(1);}
        if(page==='Category'){
          $scope.breadcrumb.items.push({name:'All Categories'});
        }else if(page==='Brand'){
          $scope.breadcrumb.items.push({name:'All Brands'});
        }
      });
    };


    var sort = $scope.products.sort = $stateParams.sort;
    var q = {where:{active:true},limit:10};


    // displayProducts(q);
    var a = {};
    $scope.filter = function(){
      var f = [];
      if ($scope.products.busy){ return; }
      $scope.products.busy = true;
      if($scope.fl.features){
        angular.forEach($scope.fl.features,function(val, key){
          if(val.length>0){
            f.push({'features.key' : key, 'features.val' : { $in: val}});
          }
        });
      }
      if($scope.fl.brands){
        if($scope.fl.brands.length>0){
          var brandIds = [];
          angular.forEach($scope.fl.brands,function(brand){
            brandIds.push(brand._id);
          });
          f.push({'brand._id' : { $in: brandIds } });
        }
      }
      if($scope.fl.categories){
        if($scope.fl.categories.length>0){
          var categoryIds = [];
          angular.forEach($scope.fl.categories,function(category){
            categoryIds.push(category._id);
          });
          f.push({'category._id' : { $in: categoryIds } });
        }
      }
      // if($scope.priceSlider)
      //f.push({'variants.price' : { $gt: $scope.priceSlider.min, $lt:$scope.priceSlider.max } });
      // console.log(f.length);
      if(f.length>0){
        q.where = { $and : f};
      }else{
        q.where = {};
      }
      // console.log(f,q);

      displayProducts(q,true);
    };

    // $scope.filterFeatures = function() {
    //   if ($scope.products.busy){ return; }
    //   $scope.products.busy = true;
    //   a.fl = [];
    //   if($scope.fl.features){
    //       angular.forEach($scope.fl.features,function(val, key){
    //         if(val.length>0){
    //           a.fl.push({'features.key' : key, 'features.val' : { $in: val}});
    //         }
    //       });
    //       if(a.fl.length>0 && a.br && a.price) {
    //         q.where = { $and : [a.price, a.br,{$and : a.fl}]};
    //       }
    //       else if(a.br && a.price) {
    //         q.where = { $and : [a.price, a.br]};
    //       }else if(a.br) {
    //         q.where = { $and : [a.br]};
    //       }else{
    //         q.where = {};
    //       }
    //       displayProducts(q,true);
    //   }
    // };
    //
    // $scope.filterBrands = function() {
    //   // This function required to query from database in place of filtering items from angular $scope,
    //   // In some cases we load only 20 products for pagination in that case we won't be able to filter properly
    //   if ($scope.products.busy){ return; }
    //   $scope.products.busy = true;
    //   a.br = [];
    //   console.log($scope.priceSlider);
    //   if($scope.fl.brands){
    //     if($scope.fl.brands.length>0){
    //       var brandIds = [];
    //       angular.forEach($scope.fl.brands,function(brand){
    //         brandIds.push(brand._id);
    //       });
    //       a.price = {'variants.price' : { $gt: $scope.priceSlider.min, $lt:$scope.priceSlider.max } };
    //         a.br = {'brand._id' : { $in: brandIds } };
    //         q.where = { $and : [a.price, a.br, {$and : a.fl}]};
    //     }else if(a.fl){
    //       q.where = { $and : [a.price, a.fl] };
    //     }else{
    //       q.where = { $and : [a.price] };
    //     }
    //   }else {
    //     q.where.brand = undefined;
    //     q.where['brand._id'] = undefined;
    //   }
    //   displayProducts(q,true);
    // };
    //
    // $scope.filterPrice = function(price) {
    //   // This function required to query from database in place of filtering items from angular $scope,
    //   // In some cases we load only 20 products for pagination in that case we won't be able to filter properly
    //   $scope.products.busy = false;
    //   $scope.products.end = false;
    //   $scope.products.after = 0;
    //   $scope.products.items = [];
    //
    //   if ($scope.products.busy){ return;}
    //   $scope.products.busy = true;
    //     console.log('price');
    //   if(price){
    //     a.price = {'variants.price' : { $gt: price.min, $lt:price.max } };
    //     q.where = { $and : [a.price, a.br, {$and : a.fl}]};
    //   }else{
    //     q.where = { $and : [a.br, {$and : a.fl}]};
    //   }
    //   // q.where['variants.price'] = { $gt: price.min, $lt:price.max };
    //   displayProducts(q,true);
    // };

    $scope.sortNow = function(sort){
        q.sort = sort;
        displayProducts(q,true);
    };

    var displayProducts = function(q,flush){
      if(flush){
        q.skip = 0;
        $scope.products.items = [];
        $scope.products.end = false;
        $scope.products.after = 0;
      }
      $loading.start('products');
      $scope.products.busy = true;
      Product.query(q, function(data){
          for (var i = 0; i < data.length; i++) {
              $scope.products.items.push(data[i]);
          }
          $scope.filtered.count = data.length + $scope.products.after;
          if(data.length>=5) { $scope.products.after = $scope.products.after + data.length; } else { $scope.products.end = true;}
          $scope.products.busy = false;
          $loading.finish('products');
      }, function(){ $scope.products.busy = false; $loading.finish('products');});

      Product.count.query(q, function(res){
        //console.log("res[0].count");
        $scope.products.count = res[0].count;
      });
    };

    $scope.resetPriceRange = function(){
      $scope.priceSlider = {
          min: 0,
          max: 10000,
          ceil: 10000,
          floor: 0
      };
      $scope.filter();
    };

    if('page' in $stateParams){
      var categoryId;
      if($stateParams.page && $stateParams._id){
        $scope.products.brand = {_id : $stateParams._id};
        $scope.breadcrumb = {type: $stateParams.page};
        generateBreadCrumb($stateParams.page,$stateParams._id);
        if($stateParams.page==='Category'){
          // categoryId = $stateParams._id;
          $scope.fl.categories.push({_id:$stateParams._id,name:$stateParams.slug});
        }else if($stateParams.page==='Brand'){
          $scope.fl.brands.push({_id:$stateParams._id,name:$stateParams.slug});
        }
        $scope.resetPriceRange();
        // q.where['brand._id'] = brandId;
        // q.where['category._id'] = categoryId;
      }else{
        q = {sort:sort,limit:10};
      }
      $scope.filter();
    }else{
      q = {limit:10};
        // console.log('wppp',q);
    }

    $scope.scroll = function() {
        if ($scope.products.busy || $scope.products.end){ return;}
        $scope.products.busy = false;
        q.skip = $scope.products.after;
        displayProducts(q);
    };


    $scope.resetPriceRange();

}]);

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('main', {
        title: 'Tecruitr',
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        params: {
          sort: null
        }
      })
      .state('productDetail', {
        title: 'Details of selected product',
        params: {
          id: null,
          slug: null
        },
        url: '/p/:slug',
        templateUrl: 'app/main/product-details.html',
        controller: 'ProductDetailsCtrl'
      })
      .state('SubProduct', {
        title: 'All products under current category or brand',
        url: '/:page/:slug/:_id',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        params: {
          id: null,
          sort: null,
          brand: null,
          category: null,
          price1: 0,
          price2: 100000
        }
      });
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('OrderCtrl', ["$scope", "Order", "toastr", function ($scope, Order, toastr) {
    $scope.orderStatusLov = Order.status;
    $scope.orders = Order.my.query({},function(res){
      var total=0;
      for(var i=0;i<res.length;i++){
          var subTotal = 0;
          for(var j=0;j<res[i].items.length;j++){
              subTotal += res[i].items[j].price * parseInt(res[i].items[j].quantity);
              total += res[i].items[j].price * parseInt(res[i].items[j].quantity);
          }
          res[i].subTotal = subTotal;
      }
      res.total = total;
    });
    $scope.changeStatus = function(order){
      Order.update({ id:order._id }, order).$promise.then(function(res) {
        console.log(res);
      }, function(error) { // error handler
        console.log(error);
        if(error.data.errors){
          var err = error.data.errors;
          toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
        }
        else{
          var msg = error.data.message;
          toastr.error(msg);
        }
      });
    };
  }]);

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('order', {
        title: 'Orders placed in recent past',
        url: '/order',
        templateUrl: 'app/order/order.html',
        controller: 'OrderCtrl',
        authenticate: true
      });
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('PaymentMethodCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('paymentMethod', {
        title: 'Define payment Methods',
        url: '/paymentMethod',
        templateUrl: 'app/paymentMethod/paymentMethod.html',
        controller: 'PaymentMethodCtrl'
      });
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('ProductCtrl', ["$scope", "socket", "Product", "Category", "Brand", "Feature", "Modal", "toastr", function ($scope, socket, Product, Category, Brand, Feature, Modal, toastr) {
    var cols = [
      {heading:'sku',dataType:'text', sortType:'lowercase'},
      {heading:'name',dataType:'text', sortType:'lowercase'},
      {heading:'info',dataType:'text', sortType:'lowercase'}
    ];
    // var cols = ['sku','name','nameLower','slug','status','info','uid', 'active','img'];
    $scope.products = [];
    $scope.product = {};
    $scope.variant = {};
    $scope.newFeature = {};
    $scope.newKF = {};
    $scope.product.variants = [];
    $scope.product.features = [];
    $scope.product.keyFeatures = [];
    // $scope.selected = {};
    // $scope.selected.feature = [];
    $scope.features = Feature.query();
    // $scope.items=$scope.features.map(function(name){ return { key:key,val:val}; })
    // $scope.selected.feature[0] = {"key":"Fit","val":"Tight"};
    $scope.products = Product.query({}, function() {
      socket.syncUpdates('product', $scope.products);
    });

    $scope.categories = Category.query(function() {
      socket.syncUpdates('category', $scope.categories);
    });
    $scope.brands = Brand.query(function() {
      socket.syncUpdates('brand', $scope.brands);
    });
    $scope.edit = function(product) {
      var title; if(product.name){ title = 'Editing ' + product.name;} else{ title = 'Add New';}
      Modal.show(product,{title:title, api:'Product', columns: cols});
    };
    $scope.save = function(product){
      if('variants' in $scope.product){
      }else{
          $scope.product.variants = [];
      }
      if('keyFeatures' in $scope.product){
      }else{
          $scope.product.keyFeatures = [];
      }
      if('features' in $scope.product){
      }else{
          $scope.product.features = [];
      }

      if('size' in $scope.variant){
        $scope.product.variants.push($scope.variant);
        // console.log($scope.product.variants);
      }
      // console.log($scope.newKF);
      if('val' in $scope.newKF){
        $scope.product.keyFeatures.push($scope.newKF.val);
        console.log($scope.product.keyFeatures);
      }
      if('key' in $scope.newFeature){
        $scope.product.features.push($scope.newFeature);
        // console.log($scope.product.features);
      }
      $scope.variant = {};
      $scope.newKF = {};
      $scope.newFeature = {};

      // $scope.feature.key = feature.key.name;
      // $scope.product.feature = $scope.selected.feature;

      // console.log($scope.selected.feature);
      if('_id' in product){
          Product.update({ id:$scope.product._id }, $scope.product).$promise.then(function() {
            toastr.success("Product info saved successfully","Success");
          }, function(error) { // error handler
            var err = error.data.errors;
            toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
          });
        }
        else{
          Product.save($scope.product).$promise.then(function() {
            toastr.success("Product info saved successfully","Success");
          }, function(error) { // error handler
              var err = error.data.errors;
              toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
          });
        }
    };
    $scope.changeActive = function(b){ // success handler
      b.active = !b.active;
      Product.update({ id:b._id }, b).$promise.then(function() {

      }, function(error) { // error handler
          // console.log(error);
          toastr.error(error.statusText + ' (' +  error.status + ')');
          b.active = !b.active;
      });
    };

    $scope.deleteFeature = function(index,product) {
      $scope.product.features.splice(index, 1);
      $scope.save(product)
    };

    $scope.deleteKF = function(index,product) {
      $scope.product.keyFeatures.splice(index, 1);
      $scope.save(product)
    };

    $scope.deleteVariants = function(index,product) {
      $scope.product.variants.splice(index, 1);
      $scope.save(product)
    };

    $scope.productDetail = function(product){
        if(product){ $scope.product = product; }
        else{ $scope.product = {}; }
    };

  }]);

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('product', {
        title: 'Products administration (Add, Remove, Edit)',
        url: '/product',
        templateUrl: 'app/product/product.html',
        controller: 'ProductCtrl',
        authenticate: true
      });
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('ShippingCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('shipping', {
        title: 'Shipping Settings',
        url: '/shipping',
        templateUrl: 'app/shipping/shipping.html',
        controller: 'ShippingCtrl'
      });
  }]);

'use strict';

angular.module('shopnxApp')
  .controller('ShopCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('shopnxApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('shop', {
        url: '/shop',
        templateUrl: 'app/shop/shop.html',
        controller: 'ShopCtrl'
      });
  }]);

'use strict';

angular.module('shopnxApp')
.value('redirectToUrlAfterLogin', { url: '/' })
  .factory('Auth', ["$location", "$rootScope", "$http", "User", "$cookieStore", "$q", "redirectToUrlAfterLogin", function Auth($location, $rootScope, $http, User, $cookieStore, $q, redirectToUrlAfterLogin) {
    var currentUser = {};
    if($cookieStore.get('token')) {
      currentUser = User.get();
    }

    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth/local', {
          email: user.email,
          password: user.password
        }).
        success(function(data) {
          $cookieStore.put('token', data.token);
          currentUser = User.get();
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        currentUser = {};
      },
      saveAttemptUrl: function() {
        if($location.path().toLowerCase() !== '/login' || $location.path().toLowerCase() !== '/signup') {
          redirectToUrlAfterLogin.url = $location.path();
        }
        else {
          redirectToUrlAfterLogin.url = '/';
        }
      },
      redirectToAttemptedUrl: function() {
        $location.path(redirectToUrlAfterLogin.url);
      },
      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function(data) {
            $cookieStore.put('token', data.token);
            currentUser = User.get();
            return cb(user);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if(currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return currentUser.role === 'admin';
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  }]);

'use strict';

angular.module('shopnxApp')
  .factory('User', ["$resource", function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  }]);

'use strict';

angular.module('shopnxApp')
.factory('Modal',['$rootScope','$modal', function ($rootScope, $modal) {

  var obj = {};
  var selectModalInstanceCtrl = function ($scope,$modalInstance, $injector, data, options, toastr) {
    var api = $injector.get(options.api);
    $scope.data = angular.copy(data);
    $scope.options = options;
    $scope.saveItem = function(item){
        if($scope.data._id){
          api.update({ id:$scope.data._id }, $scope.data).$promise.then(function() {

          }, function(error) { // error handler
            if(error.data.errors){
              var err = error.data.errors;
              toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
            }
            else{
              var msg = error.data.message;
              toastr.error(msg);
            }
          });
        }
        else{
          api.save($scope.data).$promise.then(function() {

          }, function(error) { // error handler
            if(error.data.errors){
              var err = error.data.errors;
              toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
            }
            else{
              var msg = error.data.message;
              toastr.error(msg);
            }
          });
        }
        $modalInstance.close(item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
  };

  // We need to manually inject to be minsafe
  selectModalInstanceCtrl.$inject = ['$scope', '$modalInstance', '$injector', 'data', 'options', 'toastr'];

  obj.show = function(data,options){
      var modalOptions = {
          templateUrl: 'components/modal/modal.html',
          controller: selectModalInstanceCtrl,
          controllerAs: 'modal',
          windowClass: 'modal-danger',
          resolve: {
              data: function () { return data; },
              options : function () { return options; }
          }
      };
      $modal.open(modalOptions);

  };

  return obj;

}]);

'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('shopnxApp')
  .directive('mongooseError', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.on('keydown', function() {
          return ngModel.$setValidity('mongoose', true);
        });
      }
    };
  });
/*!
 * Bootstrap v3.1.1 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one(a.support.transition.end,function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b()})}(jQuery),+function(a){"use strict";var b='[data-dismiss="alert"]',c=function(c){a(c).on("click",b,this.close)};c.prototype.close=function(b){function c(){f.trigger("closed.bs.alert").remove()}var d=a(this),e=d.attr("data-target");e||(e=d.attr("href"),e=e&&e.replace(/.*(?=#[^\s]*$)/,""));var f=a(e);b&&b.preventDefault(),f.length||(f=d.hasClass("alert")?d:d.parent()),f.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one(a.support.transition.end,c).emulateTransitionEnd(150):c())};var d=a.fn.alert;a.fn.alert=function(b){return this.each(function(){var d=a(this),e=d.data("bs.alert");e||d.data("bs.alert",e=new c(this)),"string"==typeof b&&e[b].call(d)})},a.fn.alert.Constructor=c,a.fn.alert.noConflict=function(){return a.fn.alert=d,this},a(document).on("click.bs.alert.data-api",b,c.prototype.close)}(jQuery),+function(a){"use strict";var b=function(c,d){this.$element=a(c),this.options=a.extend({},b.DEFAULTS,d),this.isLoading=!1};b.DEFAULTS={loadingText:"loading..."},b.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",f.resetText||d.data("resetText",d[e]()),d[e](f[b]||this.options[b]),setTimeout(a.proxy(function(){"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c))},this),0)},b.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")&&(c.prop("checked")&&this.$element.hasClass("active")?a=!1:b.find(".active").removeClass("active")),a&&c.prop("checked",!this.$element.hasClass("active")).trigger("change")}a&&this.$element.toggleClass("active")};var c=a.fn.button;a.fn.button=function(c){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof c&&c;e||d.data("bs.button",e=new b(this,f)),"toggle"==c?e.toggle():c&&e.setState(c)})},a.fn.button.Constructor=b,a.fn.button.noConflict=function(){return a.fn.button=c,this},a(document).on("click.bs.button.data-api","[data-toggle^=button]",function(b){var c=a(b.target);c.hasClass("btn")||(c=c.closest(".btn")),c.button("toggle"),b.preventDefault()})}(jQuery),+function(a){"use strict";var b=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=this.sliding=this.interval=this.$active=this.$items=null,"hover"==this.options.pause&&this.$element.on("mouseenter",a.proxy(this.pause,this)).on("mouseleave",a.proxy(this.cycle,this))};b.DEFAULTS={interval:5e3,pause:"hover",wrap:!0},b.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},b.prototype.getActiveIndex=function(){return this.$active=this.$element.find(".item.active"),this.$items=this.$active.parent().children(),this.$items.index(this.$active)},b.prototype.to=function(b){var c=this,d=this.getActiveIndex();return b>this.$items.length-1||0>b?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){c.to(b)}):d==b?this.pause().cycle():this.slide(b>d?"next":"prev",a(this.$items[b]))},b.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},b.prototype.next=function(){return this.sliding?void 0:this.slide("next")},b.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},b.prototype.slide=function(b,c){var d=this.$element.find(".item.active"),e=c||d[b](),f=this.interval,g="next"==b?"left":"right",h="next"==b?"first":"last",i=this;if(!e.length){if(!this.options.wrap)return;e=this.$element.find(".item")[h]()}if(e.hasClass("active"))return this.sliding=!1;var j=a.Event("slide.bs.carousel",{relatedTarget:e[0],direction:g});return this.$element.trigger(j),j.isDefaultPrevented()?void 0:(this.sliding=!0,f&&this.pause(),this.$indicators.length&&(this.$indicators.find(".active").removeClass("active"),this.$element.one("slid.bs.carousel",function(){var b=a(i.$indicators.children()[i.getActiveIndex()]);b&&b.addClass("active")})),a.support.transition&&this.$element.hasClass("slide")?(e.addClass(b),e[0].offsetWidth,d.addClass(g),e.addClass(g),d.one(a.support.transition.end,function(){e.removeClass([b,g].join(" ")).addClass("active"),d.removeClass(["active",g].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger("slid.bs.carousel")},0)}).emulateTransitionEnd(1e3*d.css("transition-duration").slice(0,-1))):(d.removeClass("active"),e.addClass("active"),this.sliding=!1,this.$element.trigger("slid.bs.carousel")),f&&this.cycle(),this)};var c=a.fn.carousel;a.fn.carousel=function(c){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},b.DEFAULTS,d.data(),"object"==typeof c&&c),g="string"==typeof c?c:f.slide;e||d.data("bs.carousel",e=new b(this,f)),"number"==typeof c?e.to(c):g?e[g]():f.interval&&e.pause().cycle()})},a.fn.carousel.Constructor=b,a.fn.carousel.noConflict=function(){return a.fn.carousel=c,this},a(document).on("click.bs.carousel.data-api","[data-slide], [data-slide-to]",function(b){var c,d=a(this),e=a(d.attr("data-target")||(c=d.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"")),f=a.extend({},e.data(),d.data()),g=d.attr("data-slide-to");g&&(f.interval=!1),e.carousel(f),(g=d.attr("data-slide-to"))&&e.data("bs.carousel").to(g),b.preventDefault()}),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var b=a(this);b.carousel(b.data())})})}(jQuery),+function(a){"use strict";var b=function(c,d){this.$element=a(c),this.options=a.extend({},b.DEFAULTS,d),this.transitioning=null,this.options.parent&&(this.$parent=a(this.options.parent)),this.options.toggle&&this.toggle()};b.DEFAULTS={toggle:!0},b.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},b.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b=a.Event("show.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.$parent&&this.$parent.find("> .panel > .in");if(c&&c.length){var d=c.data("bs.collapse");if(d&&d.transitioning)return;c.collapse("hide"),d||c.data("bs.collapse",null)}var e=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[e](0),this.transitioning=1;var f=function(){this.$element.removeClass("collapsing").addClass("collapse in")[e]("auto"),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return f.call(this);var g=a.camelCase(["scroll",e].join("-"));this.$element.one(a.support.transition.end,a.proxy(f,this)).emulateTransitionEnd(350)[e](this.$element[0][g])}}},b.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"),this.transitioning=1;var d=function(){this.transitioning=0,this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")};return a.support.transition?void this.$element[c](0).one(a.support.transition.end,a.proxy(d,this)).emulateTransitionEnd(350):d.call(this)}}},b.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()};var c=a.fn.collapse;a.fn.collapse=function(c){return this.each(function(){var d=a(this),e=d.data("bs.collapse"),f=a.extend({},b.DEFAULTS,d.data(),"object"==typeof c&&c);!e&&f.toggle&&"show"==c&&(c=!c),e||d.data("bs.collapse",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.collapse.Constructor=b,a.fn.collapse.noConflict=function(){return a.fn.collapse=c,this},a(document).on("click.bs.collapse.data-api","[data-toggle=collapse]",function(b){var c,d=a(this),e=d.attr("data-target")||b.preventDefault()||(c=d.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,""),f=a(e),g=f.data("bs.collapse"),h=g?"toggle":d.data(),i=d.attr("data-parent"),j=i&&a(i);g&&g.transitioning||(j&&j.find('[data-toggle=collapse][data-parent="'+i+'"]').not(d).addClass("collapsed"),d[f.hasClass("in")?"addClass":"removeClass"]("collapsed")),f.collapse(h)})}(jQuery),+function(a){"use strict";function b(b){a(d).remove(),a(e).each(function(){var d=c(a(this)),e={relatedTarget:this};d.hasClass("open")&&(d.trigger(b=a.Event("hide.bs.dropdown",e)),b.isDefaultPrevented()||d.removeClass("open").trigger("hidden.bs.dropdown",e))})}function c(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}var d=".dropdown-backdrop",e="[data-toggle=dropdown]",f=function(b){a(b).on("click.bs.dropdown",this.toggle)};f.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=c(e),g=f.hasClass("open");if(b(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click",b);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;f.toggleClass("open").trigger("shown.bs.dropdown",h),e.focus()}return!1}},f.prototype.keydown=function(b){if(/(38|40|27)/.test(b.keyCode)){var d=a(this);if(b.preventDefault(),b.stopPropagation(),!d.is(".disabled, :disabled")){var f=c(d),g=f.hasClass("open");if(!g||g&&27==b.keyCode)return 27==b.which&&f.find(e).focus(),d.click();var h=" li:not(.divider):visible a",i=f.find("[role=menu]"+h+", [role=listbox]"+h);if(i.length){var j=i.index(i.filter(":focus"));38==b.keyCode&&j>0&&j--,40==b.keyCode&&j<i.length-1&&j++,~j||(j=0),i.eq(j).focus()}}}};var g=a.fn.dropdown;a.fn.dropdown=function(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new f(this)),"string"==typeof b&&d[b].call(c)})},a.fn.dropdown.Constructor=f,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=g,this},a(document).on("click.bs.dropdown.data-api",b).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",e,f.prototype.toggle).on("keydown.bs.dropdown.data-api",e+", [role=menu], [role=listbox]",f.prototype.keydown)}(jQuery),+function(a){"use strict";var b=function(b,c){this.options=c,this.$element=a(b),this.$backdrop=this.isShown=null,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};b.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},b.prototype.toggle=function(a){return this[this.isShown?"hide":"show"](a)},b.prototype.show=function(b){var c=this,d=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(d),this.isShown||d.isDefaultPrevented()||(this.isShown=!0,this.escape(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.backdrop(function(){var d=a.support.transition&&c.$element.hasClass("fade");c.$element.parent().length||c.$element.appendTo(document.body),c.$element.show().scrollTop(0),d&&c.$element[0].offsetWidth,c.$element.addClass("in").attr("aria-hidden",!1),c.enforceFocus();var e=a.Event("shown.bs.modal",{relatedTarget:b});d?c.$element.find(".modal-dialog").one(a.support.transition.end,function(){c.$element.focus().trigger(e)}).emulateTransitionEnd(300):c.$element.focus().trigger(e)}))},b.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one(a.support.transition.end,a.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal())},b.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.focus()},this))},b.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keyup.dismiss.bs.modal")},b.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.removeBackdrop(),a.$element.trigger("hidden.bs.modal")})},b.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},b.prototype.backdrop=function(b){var c=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var d=a.support.transition&&c;if(this.$backdrop=a('<div class="modal-backdrop '+c+'" />').appendTo(document.body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus.call(this.$element[0]):this.hide.call(this))},this)),d&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;d?this.$backdrop.one(a.support.transition.end,b).emulateTransitionEnd(150):b()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(a.support.transition.end,b).emulateTransitionEnd(150):b()):b&&b()};var c=a.fn.modal;a.fn.modal=function(c,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},b.DEFAULTS,e.data(),"object"==typeof c&&c);f||e.data("bs.modal",f=new b(this,g)),"string"==typeof c?f[c](d):g.show&&f.show(d)})},a.fn.modal.Constructor=b,a.fn.modal.noConflict=function(){return a.fn.modal=c,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(b){var c=a(this),d=c.attr("href"),e=a(c.attr("data-target")||d&&d.replace(/.*(?=#[^\s]+$)/,"")),f=e.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(d)&&d},e.data(),c.data());c.is("a")&&b.preventDefault(),e.modal(f,this).one("hide",function(){c.is(":visible")&&c.focus()})}),a(document).on("show.bs.modal",".modal",function(){a(document.body).addClass("modal-open")}).on("hidden.bs.modal",".modal",function(){a(document.body).removeClass("modal-open")})}(jQuery),+function(a){"use strict";var b=function(a,b){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null,this.init("tooltip",a,b)};b.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1},b.prototype.init=function(b,c,d){this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d);for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},b.prototype.getDefaults=function(){return b.DEFAULTS},b.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},b.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},b.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show()},b.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide()},b.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){if(this.$element.trigger(b),b.isDefaultPrevented())return;var c=this,d=this.tip();this.setContent(),this.options.animation&&d.addClass("fade");var e="function"==typeof this.options.placement?this.options.placement.call(this,d[0],this.$element[0]):this.options.placement,f=/\s?auto?\s?/i,g=f.test(e);g&&(e=e.replace(f,"")||"top"),d.detach().css({top:0,left:0,display:"block"}).addClass(e),this.options.container?d.appendTo(this.options.container):d.insertAfter(this.$element);var h=this.getPosition(),i=d[0].offsetWidth,j=d[0].offsetHeight;if(g){var k=this.$element.parent(),l=e,m=document.documentElement.scrollTop||document.body.scrollTop,n="body"==this.options.container?window.innerWidth:k.outerWidth(),o="body"==this.options.container?window.innerHeight:k.outerHeight(),p="body"==this.options.container?0:k.offset().left;e="bottom"==e&&h.top+h.height+j-m>o?"top":"top"==e&&h.top-m-j<0?"bottom":"right"==e&&h.right+i>n?"left":"left"==e&&h.left-i<p?"right":e,d.removeClass(l).addClass(e)}var q=this.getCalculatedOffset(e,h,i,j);this.applyPlacement(q,e),this.hoverState=null;var r=function(){c.$element.trigger("shown.bs."+c.type)};a.support.transition&&this.$tip.hasClass("fade")?d.one(a.support.transition.end,r).emulateTransitionEnd(150):r()}},b.prototype.applyPlacement=function(b,c){var d,e=this.tip(),f=e[0].offsetWidth,g=e[0].offsetHeight,h=parseInt(e.css("margin-top"),10),i=parseInt(e.css("margin-left"),10);isNaN(h)&&(h=0),isNaN(i)&&(i=0),b.top=b.top+h,b.left=b.left+i,a.offset.setOffset(e[0],a.extend({using:function(a){e.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),e.addClass("in");var j=e[0].offsetWidth,k=e[0].offsetHeight;if("top"==c&&k!=g&&(d=!0,b.top=b.top+g-k),/bottom|top/.test(c)){var l=0;b.left<0&&(l=-2*b.left,b.left=0,e.offset(b),j=e[0].offsetWidth,k=e[0].offsetHeight),this.replaceArrow(l-f+j,j,"left")}else this.replaceArrow(k-g,k,"top");d&&e.offset(b)},b.prototype.replaceArrow=function(a,b,c){this.arrow().css(c,a?50*(1-a/b)+"%":"")},b.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},b.prototype.hide=function(){function b(){"in"!=c.hoverState&&d.detach(),c.$element.trigger("hidden.bs."+c.type)}var c=this,d=this.tip(),e=a.Event("hide.bs."+this.type);return this.$element.trigger(e),e.isDefaultPrevented()?void 0:(d.removeClass("in"),a.support.transition&&this.$tip.hasClass("fade")?d.one(a.support.transition.end,b).emulateTransitionEnd(150):b(),this.hoverState=null,this)},b.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},b.prototype.hasContent=function(){return this.getTitle()},b.prototype.getPosition=function(){var b=this.$element[0];return a.extend({},"function"==typeof b.getBoundingClientRect?b.getBoundingClientRect():{width:b.offsetWidth,height:b.offsetHeight},this.$element.offset())},b.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},b.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},b.prototype.tip=function(){return this.$tip=this.$tip||a(this.options.template)},b.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},b.prototype.validate=function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},b.prototype.enable=function(){this.enabled=!0},b.prototype.disable=function(){this.enabled=!1},b.prototype.toggleEnabled=function(){this.enabled=!this.enabled},b.prototype.toggle=function(b){var c=b?a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type):this;c.tip().hasClass("in")?c.leave(c):c.enter(c)},b.prototype.destroy=function(){clearTimeout(this.timeout),this.hide().$element.off("."+this.type).removeData("bs."+this.type)};var c=a.fn.tooltip;a.fn.tooltip=function(c){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof c&&c;(e||"destroy"!=c)&&(e||d.data("bs.tooltip",e=new b(this,f)),"string"==typeof c&&e[c]())})},a.fn.tooltip.Constructor=b,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=c,this}}(jQuery),+function(a){"use strict";var b=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");b.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),b.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),b.prototype.constructor=b,b.prototype.getDefaults=function(){return b.DEFAULTS},b.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content")[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},b.prototype.hasContent=function(){return this.getTitle()||this.getContent()},b.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},b.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")},b.prototype.tip=function(){return this.$tip||(this.$tip=a(this.options.template)),this.$tip};var c=a.fn.popover;a.fn.popover=function(c){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof c&&c;(e||"destroy"!=c)&&(e||d.data("bs.popover",e=new b(this,f)),"string"==typeof c&&e[c]())})},a.fn.popover.Constructor=b,a.fn.popover.noConflict=function(){return a.fn.popover=c,this}}(jQuery),+function(a){"use strict";function b(c,d){var e,f=a.proxy(this.process,this);this.$element=a(a(c).is("body")?window:c),this.$body=a("body"),this.$scrollElement=this.$element.on("scroll.bs.scroll-spy.data-api",f),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||(e=a(c).attr("href"))&&e.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.offsets=a([]),this.targets=a([]),this.activeTarget=null,this.refresh(),this.process()}b.DEFAULTS={offset:10},b.prototype.refresh=function(){var b=this.$element[0]==window?"offset":"position";this.offsets=a([]),this.targets=a([]);{var c=this;this.$body.find(this.selector).map(function(){var d=a(this),e=d.data("target")||d.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[b]().top+(!a.isWindow(c.$scrollElement.get(0))&&c.$scrollElement.scrollTop()),e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){c.offsets.push(this[0]),c.targets.push(this[1])})}},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,d=c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(b>=d)return g!=(a=f.last()[0])&&this.activate(a);if(g&&b<=e[0])return g!=(a=f[0])&&this.activate(a);for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(!e[a+1]||b<=e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,a(this.selector).parentsUntil(this.options.target,".active").removeClass("active");var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")};var c=a.fn.scrollspy;a.fn.scrollspy=function(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=c,this},a(window).on("load",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);b.scrollspy(b.data())})})}(jQuery),+function(a){"use strict";var b=function(b){this.element=a(b)};b.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a")[0],f=a.Event("show.bs.tab",{relatedTarget:e});if(b.trigger(f),!f.isDefaultPrevented()){var g=a(d);this.activate(b.parent("li"),c),this.activate(g,g.parent(),function(){b.trigger({type:"shown.bs.tab",relatedTarget:e})})}}},b.prototype.activate=function(b,c,d){function e(){f.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),b.addClass("active"),g?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu")&&b.closest("li.dropdown").addClass("active"),d&&d()}var f=c.find("> .active"),g=d&&a.support.transition&&f.hasClass("fade");g?f.one(a.support.transition.end,e).emulateTransitionEnd(150):e(),f.removeClass("in")};var c=a.fn.tab;a.fn.tab=function(c){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new b(this)),"string"==typeof c&&e[c]()})},a.fn.tab.Constructor=b,a.fn.tab.noConflict=function(){return a.fn.tab=c,this},a(document).on("click.bs.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(b){b.preventDefault(),a(this).tab("show")})}(jQuery),+function(a){"use strict";var b=function(c,d){this.options=a.extend({},b.DEFAULTS,d),this.$window=a(window).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(c),this.affixed=this.unpin=this.pinnedOffset=null,this.checkPosition()};b.RESET="affix affix-top affix-bottom",b.DEFAULTS={offset:0},b.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(b.RESET).addClass("affix");var a=this.$window.scrollTop(),c=this.$element.offset();return this.pinnedOffset=c.top-a},b.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},b.prototype.checkPosition=function(){if(this.$element.is(":visible")){var c=a(document).height(),d=this.$window.scrollTop(),e=this.$element.offset(),f=this.options.offset,g=f.top,h=f.bottom;"top"==this.affixed&&(e.top+=d),"object"!=typeof f&&(h=g=f),"function"==typeof g&&(g=f.top(this.$element)),"function"==typeof h&&(h=f.bottom(this.$element));var i=null!=this.unpin&&d+this.unpin<=e.top?!1:null!=h&&e.top+this.$element.height()>=c-h?"bottom":null!=g&&g>=d?"top":!1;if(this.affixed!==i){this.unpin&&this.$element.css("top","");var j="affix"+(i?"-"+i:""),k=a.Event(j+".bs.affix");this.$element.trigger(k),k.isDefaultPrevented()||(this.affixed=i,this.unpin="bottom"==i?this.getPinnedOffset():null,this.$element.removeClass(b.RESET).addClass(j).trigger(a.Event(j.replace("affix","affixed"))),"bottom"==i&&this.$element.offset({top:c-h-this.$element.height()}))}}};var c=a.fn.affix;a.fn.affix=function(c){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof c&&c;e||d.data("bs.affix",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.affix.Constructor=b,a.fn.affix.noConflict=function(){return a.fn.affix=c,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var b=a(this),c=b.data();c.offset=c.offset||{},c.offsetBottom&&(c.offset.bottom=c.offsetBottom),c.offsetTop&&(c.offset.top=c.offsetTop),b.affix(c)})})}(jQuery);
'use strict';

angular.module('shopnxApp')
  .controller('NavbarCtrl', ['$scope', '$rootScope', '$location', 'Auth', '$modal', 'Cart', 'Category', 'Brand', 'SortOptions', '$q', 'Product', '$state', function ($scope, $rootScope, $location, Auth, $modal, Cart, Category, Brand,SortOptions,$q, Product, $state) {
    $scope.hideSubMenu = function(){
      // $('.megamenu .dropdown:hover .dropdown-menu').hide(); // Hide the navbar submenu once a category is selected
    }
    $rootScope.cart = Cart.cart;
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $rootScope.brands = Brand.query({active:true});
    $rootScope.sortOptions = SortOptions.server;

    $scope.isCollapsed = true;
    $scope.isCollapsed1 = true;
    $rootScope.isLoggedIn = Auth.isLoggedIn;
    $rootScope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $rootScope.checkCart = function(id){
        if(!_.contains($scope.cart.skuArray, id)){
            return true;
        }else{
            return false;
        }
    };

    $rootScope.getQuantity = function(sku){
        for(var i = 0;i<$scope.cart.items.length;i++){
            if($scope.cart.items[i].sku === sku){
              return $scope.cart.items[i].quantity;
            }
        }
    };

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.onSelectProduct = function($item){
        $state.go('productDetail', {id:$item._id, slug:$item.slug}, {reload: false});
        $scope.search = '';
    };

    $scope.categories = Category.all.query();

// // Script which calls all category from parent 0 and constructs the category hierarchy
// // This was moved to the server and now 1 call does it all instead 1 for each parent category + 1 for parent category itself
// var p = [];
// Category.parent.query({id:0},function(parents){
//     angular.forEach(parents,function(a){
//         a.children = [];
//         Category.parent.query({id:a.category},function(children){
//           a.children = children;
//         });
//         p.push(a);
//     });
//         $scope.categories = p;
//         // console.log(p);
// });

    $scope.globalSearch = function(input){
          input = input.toLowerCase();
            var defer = $q.defer();
            if (input){
                Product.query({where:{nameLower: {'$regex': input}}, limit:10, select: {id: 1, name:1, slug: 1}},
                    function(data){
                          console.log(data);
                        if (!$scope.$$phase){ //check if digest is not in progress
                            $rootScope.$apply(function(){
                                defer.resolve(data);
                            });
                        } else {
                            defer.resolve(data);
                        }
                    },
                    function(response){
                        if (!$scope.$$phase){
                            $rootScope.$apply(function(){
                                defer.reject('Server rejected with status ' + response.status);
                            });
                        } else {
                            defer.reject('Server rejected with status ' + response.status);
                        }
                    });
            } else {
                if (!$scope.$$phase){
                    $rootScope.$apply(function(){
                        defer.reject('No search query ');
                        // $log.info('No search query provided');
                    });
                } else {
                    defer.reject('No search query ');
                    // $log.info('No search query provided');
                }
            }
            return defer.promise;
        };

        $scope.openCart = function (cart) {
            cart = $scope.cart = cart;
            // console.log(cart);

            var modalOptions = {
                templateUrl: 'app/cart/cart.html',
                controller: cartEditCtrl,
                controllerAs: 'modal',
                windowClass: 'ab-modal-window',
                resolve: {
                    cart: function () { return cart; },
                }
            };
            $modal.open(modalOptions);

        };
        var cartEditCtrl = function ($scope, $modalInstance, cart) {
            $scope.cart = cart;
            $scope.cancel = function () {
                $modalInstance.dismiss('Close');
            };
        };
        cartEditCtrl.$inject = ['$scope', '$modalInstance', 'cart'];
  }]);

/* global io */
'use strict';

angular.module('shopnxApp')
  .factory('socket', ["socketFactory", function(socketFactory) {

    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket: ioSocket
    });

    return {
      socket: socket,

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates: function (modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':save', function (item) {
          var oldItem = _.find(array, {_id: item._id});
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates: function (modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      }
    };
  }]);

angular.module('shopnxApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/account/login/login.html',
    "<div class=container><div class=row><div class=col-md-3></div><div class=col-md-6><div class=box><h1>Login</h1><p class=lead>Already our customer?</p><!-- <p class=\"text-muted\">\n" +
    "              Default account is <code>test@test.com</code> / <code>test</code><br/>Admin account is <code>admin@admin.com</code> / <code>admin</code></p>\n" +
    "            </p>--><hr><form ng-submit=login(form) name=form novalidate><div class=form-group><label for=email>Email</label><input type=email name=email class=form-control ng-model=user.email required placeholder=\"Youe email id\"><p class=help-block ng-show=\"form.email.$dirty && form.email.$error.required\">Please enter your email.</p></div><div class=form-group><label for=password>Password</label><input type=password name=password class=form-control ng-model=user.password required placeholder=Password><p class=help-block ng-show=\"form.password.$dirty && form.password.$error.required\">Please enter your password.</p></div><div class=\"form-group has-error\"><p class=help-block ng-show=\"form.email.$error.required && form.password.$error.required && submitted\">Please enter your email and password.</p><p class=help-block ng-show=\"form.email.$error.email && submitted\">Please enter a valid email.</p><p class=help-block>{{ errors.other }}</p></div><div class=text-center><button class=\"btn btn-inverse btn-lg btn-login btn-primary\" type=submit ng-disabled=\"form.$dirty && form.$invalid\">Login</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href=/signup>Sign up</a></div></form></div></div><div class=col-md-3></div></div><hr></div>"
  );


  $templateCache.put('app/account/settings/settings.html',
    "<div class=container><div class=row><div class=col-md-3></div><div class=col-md-6><div class=box><h1>Change Password</h1><form class=form name=form ng-submit=changePassword(form) novalidate><div class=form-group><label>Current Password</label><input type=password name=password class=form-control ng-model=user.oldPassword mongoose-error placeholder=\"Old password\"><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.other }}</p></div><div class=form-group><label>New Password</label><input type=password name=newPassword class=form-control ng-model=user.newPassword ng-minlength=3 required placeholder=\"Set a new password\"><p class=help-block ng-show=\"(form.newPassword.$error.minlength || form.newPassword.$error.required) && (form.newPassword.$dirty || submitted)\">Password must be at least 3 characters.</p></div><p class=help-block>{{ message }}</p><button class=\"btn btn-lg btn-primary\" type=submit>Save changes</button></form></div></div><div class=col-md-3></div></div></div>"
  );


  $templateCache.put('app/account/signup/signup.html',
    "<div class=container><div class=row><div class=col-md-3></div><div class=col-md-6><div class=box><h1>New account</h1><p class=lead>Not our registered customer yet?</p><p></p><p class=text-muted>If you have any questions, please feel free to <a href=/contact>contact us</a>, our customer service center is working for you 24/7.</p><hr><form ng-submit=register(form) novalidate name=form><div class=form-group ng-class=\"{ 'has-success': form.name.$valid && submitted,\n" +
    "                                                  'has-error': form.name.$invalid && submitted }\"><label>Name</label><input name=name class=form-control ng-model=user.name required placeholder=\"Your name\"><p class=help-block ng-show=\"form.name.$error.required && submitted\">A name is required</p></div><div class=form-group ng-class=\"{ 'has-success': form.email.$valid && submitted,\n" +
    "                                                  'has-error': form.email.$invalid && submitted }\"><label>Email</label><input type=email name=email class=form-control ng-model=user.email required mongoose-error placeholder=\"Email ID\"><p class=help-block ng-show=\"form.email.$error.email && submitted\">Doesn't look like a valid email.</p><p class=help-block ng-show=\"form.email.$error.required && submitted\">What's your email address?</p><p class=help-block ng-show=form.email.$error.mongoose>{{ errors.email }}</p></div><div class=form-group ng-class=\"{ 'has-success': form.password.$valid && submitted,\n" +
    "                                                  'has-error': form.password.$invalid && submitted }\"><label>Password</label><input type=password name=password class=form-control ng-model=user.password ng-minlength=3 required mongoose-error placeholder=\"Password\"><p class=help-block ng-show=\"(form.password.$error.minlength || form.password.$error.required) && submitted\">Password must be at least 3 characters.</p><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.password }}</p></div><div class=text-center><button type=submit class=\"btn btn-primary\"><i class=\"fa fa-user-md\"></i> Sign up</button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href=/login>Login</a></div></form></div></div><div class=col-md-3></div></div><hr></div>"
  );


  $templateCache.put('app/admin/admin.html',
    "<div class=container><p class=text-center><em>This shop settings page is restricted to users with the 'admin' role.</em></p><div class=row><div class=col-md-9></div><div class=col-md-3></div></div></div>"
  );


  $templateCache.put('app/brand/brand.html',
    "<div class=col-md-12><crud-table api=Brand cols=[{&quot;name&quot;:&quot;text&quot;},{&quot;info&quot;:&quot;text&quot;},{&quot;image&quot;:&quot;text&quot;},{&quot;active&quot;:&quot;boolean&quot;}]></crud-table></div>"
  );


  $templateCache.put('app/cart/cart.html',
    "<style>/*td{padding: 0 5px;}*/</style><button type=button class=close ng-click=cancel();><i class=\"fa fa-times-circle-o\" style=margin:10px;color:blue></i></button><div class=modal-header><h3 class=modal-title>Shortlisted candidates</h3>- {{cart.getTotalCount()}}</div><div class=modal-body><div class=actions-continue><button class=\"btn btn-default pull-left\" ng-click=cart.clearItems(); ng-disabled=\"cart.getTotalCount() <= 0\">Clear list</button><!--<input type=\"text\" placeholder=\"Filter\" class=\"form-control col-md-4\" style=\"width:250px;margin-left:20px;\" ng-model=\"filterCart\" autofocus/>--> <button value=\"Proceed to Checkout →\" name=proceed class=\"btn btn-primary pull-right\" onclick=\"window.location.href='/scheduleInterview'\" ng-disabled=\"cart.getTotalCount() <= 0\" ng-click=cancel();>Schedule an interview →</button><div class=clearfix></div></div><br><table class=\"cart table table-striped\"><thead><tr><th>#</th><th></th><th>Name</th><th>unlist</th></tr></thead><tbody><!-- empty cart message --><tr ng-hide=\"cart.getTotalCount() > 0\"><td class=tdCenter colspan=7>. &nbsp;&nbsp;<a class=\"btn btn-primary\" href=\"/\" ng-click=cancel();>Find People</a></td></tr><tr ng-repeat=\"item in cart.items | filter: filterCart\"><td>{{$index+1}}</td><td class=product-thumbnail><a><img ng-src=/assets/clothing/{{item.image}} alt={{item.name}} data-err-src=images/product.jpg width=\"54px\"></a></td><td class=product-name><a ui-sref=\"productDetail({id:item.sku, slug:item.slug})\" ng-click=cancel();>{{item.name}}</a></td><!-- <td>{{item.price | currency}}</td>\n" +
    "\n" +
    "                <td>\n" +
    "                    <div class=\"input-group\" style=\"width:105px;\">\n" +
    "                      <div class=\"input-group-addon btn\" ng-disabled=\"item.quantity <= 1\" ng-click=\"cart.addItem(item.sku, item.name, item.slug, item.mrp, item.price, -1)\">-</div>\n" +
    "                      <input class=\"form-control\" type=\"text\" min=\"1\" step=\"1\" ng-model=\"item.quantity\" ng-change=\"cart.saveItems()\">\n" +
    "                      <div class=\"input-group-addon btn\" ng-disabled=\"item.quantity >= 1000\" ng-click=\"cart.addItem(item.sku, item.name, item.slug, item.mrp, item.price, +1)\">+</div>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "\n" +
    "                <td><span><strong>{{item.price * item.quantity | currency}}</strong></span></td>--><td class=product-actions><a title=\"Remove this item\" class=remove href=\"\" ng-click=\"cart.addItem(item.sku, item.name,item.slug, item.mrp, item.price, -10000000)\"><i class=\"fa fa-times\"></i></a></td></tr></tbody></table></div>"
  );


  $templateCache.put('app/category/category.html',
    "<div class=col-md-12><crud-table api=Category cols=[{&quot;name&quot;:&quot;text&quot;},{&quot;info&quot;:&quot;text&quot;},{&quot;category&quot;:&quot;number&quot;},{&quot;parentCategory&quot;:&quot;number&quot;},{&quot;active&quot;:&quot;boolean&quot;}]></crud-table></div>"
  );


  $templateCache.put('app/checkout/checkout.html',
    "<div class=col-md-12><ul class=breadcrumb><li><a href=\"/\">Home</a></li><li>Checkout</li></ul></div><div class=col-md-7 id=checkout><div class=box><form name=checkout_form class=form-horizontal role=form novalidate ng-show=\"cart.getTotalCount() > 0\"><ul class=\"nav nav-pills nav-justified\"><li class=active><a href=#><i class=\"fa fa-map-marker\"></i><br>Address</a></li><li class=disabled><a href=#><i class=\"fa fa-truck\"></i><br>Delivery Method</a></li><li class=disabled><a href=#><i class=\"fa fa-money\"></i><br>Payment Method</a></li><li class=disabled><a href=#><i class=\"fa fa-eye\"></i><br>Order Review</a></li></ul><div class=panel-heading><h3 class=panel-title>Enter shipping details</h3></div><div class=panel-body><div class=form-group><label class=\"col-sm-3 control-label no-padding-right\">Phone</label><div class=col-sm-7><span class=\"block input-icon input-icon-right\"><input name=phone class=form-control placeholder=\"Your phone number\" ng-model=customer.phone required tabindex=1 autofocus> <small class=errorMessage ng-show=\"checkout_form.phone.$dirty && checkout_form.phone.$error.isCustomer\">Your phone number required.</small></span></div></div><div class=form-group><label class=\"col-sm-3 control-label no-padding-right\">Name</label><div class=col-sm-7><span class=\"block input-icon input-icon-right\"><input ng-model=customer.name name=name class=form-control required placeholder=\"Your name here\" tabindex=\"2\"> <small class=errorMessage ng-show=\"checkout_form.name.$dirty && checkout_form.name.$invalid\">Your name required.</small></span></div></div><div class=form-group><label class=\"col-sm-3 control-label no-padding-right\">Address</label><div class=col-sm-7><span class=\"block input-icon input-icon-right\"><textarea name=address ng-model=customer.address class=form-control required placeholder=Address tabindex=4></textarea><small class=errorMessage ng-show=\"checkout_form.address.$dirty && checkout_form.address.$invalid\">We need your address to deliver.</small></span></div></div><div class=form-group><label class=\"col-sm-3 control-label no-padding-right\">City</label><div class=col-sm-7><span class=\"block input-icon input-icon-right\"><input name=city ng-model=customer.city class=form-control placeholder=\"Your city\" tabindex=\"5\"> <small class=errorMessage ng-show=\"checkout_form.city.$dirty && checkout_form.city.$invalid\">Please select your city.</small></span></div></div><div class=form-group><label class=\"col-sm-3 control-label no-padding-right\">Country</label><div class=col-sm-7><span class=\"block input-icon input-icon-right\"><select name=paymentMethod ng-model=customer.country class=form-control required ng-options=\"option.name for option in countries | orderBy:'name' track by option.code\" ng-change=calculateShipping(customer.country); class=form-control></select><div ng-if=!shipping._id>Sorry... We do not ship to this Country.</div><small class=errorMessage ng-show=\"checkout_form.country.$dirty && checkout_form.country.$invalid\">Please select your country.</small></span></div></div><div class=form-group><label class=\"col-sm-3 control-label no-padding-right\">Payment Method</label><div class=col-sm-7><span class=\"block input-icon input-icon-right\"><select name=paymentMethod ng-model=customer.paymentMethod class=form-control required ng-options=\"option.name for option in paymentMethods | orderBy:'name' track by option._id\" class=form-control></select><small class=errorMessage ng-show=\"checkout_form.paymentMethod.$dirty && checkout_form.paymentMethod.$invalid\">Please select payment method.</small></span></div></div><div class=form-group><label class=\"col-sm-3 control-label no-padding-right\">Coupon</label><div class=col-sm-7><span class=\"block input-icon input-icon-right\"><input name=coupon ng-model=customer.coupon class=form-control placeholder=\"Discount Coupon\" tabindex=5 ng-change=\"checkCoupon(customer.coupon, cart.getTotalPrice());\"> <span class=\"text-muted text-success\" ng-if=coupon.code>{{coupon.type}} of {{coupon.amount | currency}} was applied to the cart</span> <small class=errorMessage ng-show=\"checkout_form.coupon.$dirty && checkout_form.coupon.$invalid\">Discount coupon was expired.</small></span></div></div></div><div class=box-footer><div class=pull-left><a href=\"/\" class=\"btn btn-default\"><i class=\"fa fa-chevron-left\"></i>Back to basket</a></div><div class=pull-right><button type=submit class=\"btn btn-primary\" ng-click=placeOrder(cart.items);cart.checkout(customer.paymentMethod);cart.clearItems(); ng-disabled=\"checkout_form.$invalid || !shipping._id\" tabindex=6>Make Payment<i class=\"fa fa-chevron-right\"></i></button></div></div></form></div><!-- /.box --></div><!-- /.col-md-9 --><div class=col-md-5><div class=box id=order-summary ng-if=\"cart.getTotalCount()>0\"><div class=box-header><h3>Order summary</h3></div><p class=text-muted>Shipping and additional costs are calculated based on the values you have entered.</p><div class=table-responsive><table class=table><tbody><tr><td>Order subtotal</td><th>{{cart.getTotalPrice() | currency}}</th></tr><tr><td>Shipping and handling</td><td ng-if=\"cart.getTotalPrice()>=shipping.minOrderValue\">Free Shipping</td><td ng-if=\"cart.getTotalPrice()<=shipping.minOrderValue\">{{shipping.charge | currency}}<br><small><i><a href=\"/\">Shop</a> {{shipping.minOrderValue-cart.getTotalPrice() | currency}} more for free shipping</i></small></td></tr><tr ng-if=coupon.amount><td>Coupon Discount</td><td><small>{{coupon.amount | currency}}</small></td></tr><tr class=total><td>Total</td><th ng-if=\"cart.getTotalPrice() >= shipping.minOrderValue\">{{cart.getTotalPrice() - coupon.amount | currency}}</th><th ng-if=\"cart.getTotalPrice() < shipping.minOrderValue\">{{cart.getTotalPrice() + shipping.charge - coupon.amount | currency}}</th></tr></tbody></table></div></div></div><!-- /.col-md-3 -->"
  );


  $templateCache.put('app/contact/contact.html',
    "<div class=col-md-12><ul class=breadcrumb><li><a href=\"/\">Home</a></li><li>Contact</li></ul></div><div class=col-md-3><!-- *** PAGES MENU ***\n" +
    "_________________________________________________________ --><!-- <div class=\"panel panel-default sidebar-menu\">\n" +
    "\n" +
    "        <div class=\"panel-heading\">\n" +
    "            <h3 class=\"panel-title\">Pages</h3>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"panel-body\">\n" +
    "            <ul class=\"nav nav-pills nav-stacked\">\n" +
    "                <li>\n" +
    "                    <a href=\"#\">Text page</a>\n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <a href=\"#\">Contact page</a>\n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <a href=\"#\">FAQ</a>\n" +
    "                </li>\n" +
    "\n" +
    "            </ul>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- *** PAGES MENU END *** --><!--<div class=\"banner\">\n" +
    "        <a href=\"#\">\n" +
    "            <img src=\"/assets/img/banner.jpg\" alt=\"sales 2014\" class=\"img-responsive\">\n" +
    "        </a>\n" +
    "    </div>--></div><div class=col-md-12><div class=box id=contact><h1>Contact</h1><p class=lead>Are you curious about something? Do you have some kind of problem with our product?</p><p>Please feel free to contact us, our customer service center is working for you 24/7.</p><hr><div class=row><div class=col-sm-4><h3><i class=\"fa fa-map-marker\"></i> Address</h3><p>Tecruitr<br>Wastinit Technologies<br>Vel tech univesity<br>Chennai<br>Tamilnadu <strong>India</strong></p></div><!-- /.col-sm-4 --><div class=col-sm-4><h3><i class=\"fa fa-phone\"></i> Call center</h3><p class=text-muted>This number is toll free if calling from India otherwise we advise you to use the electronic form of communication.</p><p><strong>+91 9999999999</strong></p></div><!-- /.col-sm-4 --><div class=col-sm-4><h3><i class=\"fa fa-envelope\"></i> Electronic support</h3><p class=text-muted>Please feel free to write an email to us or to use our electronic ticketing system.</p><ul><li><strong><a href=mailto:>info@tecruitr.com</a></strong></li><li><strong><a href=#>Ticketio</a></strong> - our ticketing support platform</li></ul></div><!-- /.col-sm-4 --></div><!-- /.row --><hr><div id=map></div><hr><h2>Contact form</h2><form><div class=row><div class=col-sm-6><div class=form-group><label for=firstname>Firstname</label><input class=form-control id=firstname></div></div><div class=col-sm-6><div class=form-group><label for=lastname>Lastname</label><input class=form-control id=lastname></div></div><div class=col-sm-6><div class=form-group><label for=email>Email</label><input class=form-control id=email></div></div><div class=col-sm-6><div class=form-group><label for=subject>Subject</label><input class=form-control id=subject></div></div><div class=col-sm-12><div class=form-group><label for=message>Message</label><textarea id=message class=form-control></textarea></div></div><div class=\"col-sm-12 text-center\"><button type=submit class=\"btn btn-primary\"><i class=\"fa fa-envelope-o\"></i> Send message</button></div></div><!-- /.row --></form></div></div><!-- /.col-md-9 -->"
  );


  $templateCache.put('app/coupon/coupon.html',
    "<div class=col-md-12><crud-table api=Coupon cols=[{&quot;code&quot;:&quot;text&quot;},{&quot;amount&quot;:&quot;currency&quot;},{&quot;minimumCartValue&quot;:&quot;currency&quot;},{&quot;info&quot;:&quot;text&quot;},{&quot;type&quot;:&quot;text&quot;},{&quot;active&quot;:&quot;boolean&quot;}]></crud-table></div>"
  );


  $templateCache.put('app/customer/customer.html',
    "<div class=col-md-12><crud-table api=User cols=[{&quot;name&quot;:&quot;text&quot;},{&quot;email&quot;:&quot;text&quot;}] noedit=true></crud-table></div>"
  );


  $templateCache.put('app/dashboard/dashboard.html',
    "<div class=col-md-12>This is the dashboard view.</div>"
  );


  $templateCache.put('app/directive/table.html',
    "<link rel=stylesheet href=\"bower_components/angular-tablesort/tablesort.css\"><div class=box><div class=row><div class=col-sm-12><h1></h1><div class=table-responsive><div class=\"panel panel-primary\"><div class=panel-heading>List of {{title}}<div class=sw-search><div class=nav-search id=nav-search><span class=input-icon><input placeholder=\"Filter list ...\" class=nav-search-input ng-model=filter autocomplete=off style=width:300px autofocus> <i class=\"search-icon fa fa-search nav-search-icon\"></i></span></div></div><!-- <span class=\"pull-right hidden-xs\">\n" +
    "                <div ng-hide=\"data.length>-1\"><i class=\"fa fa-cog fa-3x fa-spin\"></i>&nbsp;Loading</div>&nbsp;\n" +
    "                <b>{{data.length}}</b> {{title}} found &nbsp;\n" +
    "              </span> --></div><div class=panel-footer><div class=row><div class=col-xs-12 dw-loading=crudTable dw-loading-options=\"{text: ''}\"><button type=button class=\"btn btn-danger\" ng-click=edit({}); ng-if=!noadd>Add New <i class=\"fa fa-plus\"></i></button></div></div></div><div class=panel-body><table class=\"table table-striped\" ts-wrapper><thead><tr><th>#</th><th ng-repeat=\"c in cols\" ts-criteria=\"{{c.heading}} | {{c.sortType}}\">{{c.heading | labelCase}}</th><th>Edit / Remove</th></tr></thead><tbody><!-- <i class=\"fa fa-cog fa-spin fa-2x\" ng-if=\"loadingTable\"></i> --><tr ng-repeat=\"p in data.slice().reverse() | filter:filter track by p._id\" id={{p._id}} ts-repeat><td>{{$index+1}}</td><td ng-repeat=\"c in cols\" ng-switch=c.dataType><span ng-switch-when=boolean><button class=btn ng-class=\"{true:'btn-success', false:''}[p[c.heading]]\" ng-click=changeActive(p);>{{p.active | active}}</button></span> <span ng-switch-when=date>{{p[c.heading] | amCalendar}}</span> <span ng-switch-when=currency>{{p[c.heading] | currency}}</span> <span ng-switch-when=image><img src=\"images/{{p.image}}\"></span> <span ng-switch-default>{{p[c.heading]}}</span></td><td><div class=btn-group><a class=\"btn btn-default btn-sm btn-default\" ng-click=edit(p); ng-if=!noedit><i class=\"fa fa-edit\"></i></a> <a class=\"btn btn-default btn-sm btn-danger\" ng-confirm-message=\"Are you sure to delete?\" ng-confirm-click=delete(p) item=p ng-if=!nodelete><i class=\"fa fa-trash-o\"></i></a></div></td></tr></tbody></table></div></div></div></div></div></div>"
  );


  $templateCache.put('app/documentation/documentation.html',
    "<div class=col-md-12><ul class=breadcrumb><li><a href=#>Home</a></li><li>Documentation</li></ul></div><!-- *** LEFT COLUMN ***\n" +
    "_________________________________________________________ --><div class=col-sm-9 id=blog-listing data-spy=scroll data-target=#navbar-example><div class=post><h2 id=live-demos>Live Demos</h2><p class=intro>ShopNx is a ready to use single page ecommerce website developed using AngularJS, NodeJS, Express, MongoDB<br><a class=\"btn btn-primary\" href=\"http://biri.in/\">Live Demo</a></p><blockquote><p>Easy to start and rich user interactive</p></blockquote><p class=read-more><a href=#features class=\"btn btn-primary\">More Features...</a></p><div class=image><img src=/assets/img/biri.jpg class=img-responsive alt=\"Live Demos\"></div><hr></div><div class=post><h2 id=installation>Installation</h2><p class=intro>Just 3 steps to install the application in your local machine.</p><p><h4>Step-1:</h4></p><p>Download, Install <a href=\"https://nodejs.org/\">NodeJS</a> (Acts as our Server)<br>Download, Install <a href=\"https://www.mongodb.org/\">MongoDB</a> (The Database for our application). We also need to run mongodb. Browse to the <em>(MongoDB installation folder)/bin</em> and run mongod</p><h4>Step-2:</h4>Unzip the downloaded file<h4>Step-3:</h4><em>Windows</em> Double click on start.bat found inside the directory<br>Now your browser should automatically open up with the application running on <a href=\"http://localhost:8080/\">http://localhost:8080</a><br><em>Linux</em> Open your terminal, navigate to the extracted directory and enter the command <em>node .</em><br>Open your browser and navigate to <a href=\"http://localhost:8080/\">http://localhost:8080</a><br><br><b>If you face any issue, I will do it for you in your machine or server</b><blockquote>There are web hosting solutions which offers free hosting for this APP. (e.g. Openshift, Amazon web services, Heroku)</blockquote><div class=image><a><img src=/assets/img/installation.jpg class=img-responsive alt=\"Installation instructions\"></a></div><hr></div><h3>:::::::::::::: Store Front :::::::::::::::::::::</h3><div class=post><h2 id=store>Store</h2><p>This example store is an ecommerce application to sell <em>Fashion Products</em> of different brands and types. But this single page web application is capable of selling any type of products, starting from Home Appliances, Mobiles, Grocerry, Footwear, Cosmetics, etc...</p><p>This view displays all products with following facilities<ul><li>Product search</li><div class=image><a><img src=/assets/img/search.jpg class=img-responsive alt=Search></a></div><li>Filter by brand, category, price (with price slider)</li><div class=image><a><img src=/assets/img/brand.jpg class=img-responsive alt=\"Brand Filter\"></a></div><li>Sort products by price or product name</li><div class=image><a><img src=/assets/img/sort.jpg class=img-responsive alt=Sort></a></div><li>Add to cart</li><li>Checkout with paypal</li><li>Auto paging facility which activates on scroll (Like most of the advanced shopping websites)</li><li>Get detailed information about specific products by clicking in on its name or image</li><li>See a quick view of present quantity in the cart with option to change cart quantity.</li></ul></p><div class=image><a><img src=/assets/img/store.jpg class=img-responsive alt=\"Store Front\"></a></div><hr></div><div class=post><h2 id=product-details>Product Details</h2><p>Shows all available details of the products<ul><li>Product Name</li><li>Product Description</li><li>Product Image</li><li>Brand</li><li>Category of the product</li><li>Product MRP (Max Retail Price) and Offer Price</li><li>Additional product details and instructions</li><li>This view also allow users to add the product into the cart or remove from cart</li></ul></p><div class=image><a><img src=/assets/img/product-details.jpg class=img-responsive alt=\"Product Details\"></a></div><hr></div><div class=post><h2 id=orders-history>Orders History</h2><p><em>For Users:</em> All the orders placed by the logged in user is available in this view.</p><p><em>For Administrators:</em> This view presents all orders placed by users with the option to change order status and shipping</p><div class=image><a><img src=/assets/img/orders.jpg class=img-responsive alt=\"Orders History\"></a></div><hr></div><div class=post><h2 id=shopping-cart>Shopping Cart</h2><p>This store is featured with a shopping cart facility which is easy to use and fast.<ul><li>Get quick summary of what is there in Cart</li><li>Modify the cart quantity</li><li>Checkout using Paypal</li></ul></p><div class=image><a><img src=/assets/img/cart.jpg class=img-responsive alt=\"Shopping Cart\"></a></div><hr></div><div class=post><h2 id=accounts-page>Accounts Page</h2><p>Features like Signup / SignIn / Change Password / Logout is integrated into this application already with high level of security, so that you no longer need to be worry about implementing all those features into the application</p><div class=image><a><img src=/assets/img/user-menu.jpg class=img-responsive alt=\"Accounts Page\"></a></div><div class=image><a><img src=/assets/img/login.jpg class=img-responsive alt=\"Accounts Page\"></a></div><hr></div><h3>::::::::::::::: Store Administration ::::::::::::::</h3><blockquote><em>Only administrators can access the pages</em></blockquote><div class=post><h2 id=add-brands>Manage Brands</h2><p>Administrators can add, edit, delete, filter brands of their store from this view</p><div class=image><a><img src=/assets/img/brands.jpg class=img-responsive alt=\"Manage Brands\"></a></div><hr></div><div class=post><h2 id=add-categories>Manage Categories</h2><p><ul><li>Categories are presented in Parent-Child manner in this store for better organisation of products.</li><li>Store's navigation bar at top contains all the categories arranged in parent-child fashion.</li><div class=image><a><img src=/assets/img/navbar.jpg class=img-responsive alt=\"Manage Categories\"></a></div><li>This view provides facility to add both parent and child categories, edit them, re-arrange category association according to their requirement.</li></ul></p><div class=image><a><img src=/assets/img/categories.jpg class=img-responsive alt=\"Manage Categories\"></a></div><hr></div><div class=post><h2 id=add-products>Manage Products</h2><p><em>This is the main page for administrators to manage products at store.</em><ul><li>The right sidebar lists all the available products with a search box to filter the list.</li><li>Clicking on a product at the product list will populate the details of the product at the left sidebar</li><li>The left sidebar has option to change product name, details, brand, category</li><li>This left sidebar also contains a module to manage product variants which has facility for Size, MRP, Price and Image for that perticular variant</li></ul></p><div class=image><a><img src=/assets/img/products.jpg class=img-responsive alt=\"Add Products\"></a></div><hr></div><div class=post><h2 id=manage-users>Manage Users (Customers)</h2><p>Using this view administrators can add, remove or edit users of their shopping web application</p><div class=image><a><img src=/assets/img/customers.jpg class=img-responsive alt=\"Manage customers\"></a></div><hr></div><div class=post><h2 id=features>All Features</h2><h3>### Store Front features</h3><ul><li>Single page web app (SPA) created using AngularJS, NodeJS, Express, MongoDB (MEAN)</li><li>Fastest shop experience</li><li>Fast Product Search, Filter with AJAX</li><li>Price slider and multiple brand selector</li><li>Faster Add to Cart and Product Details</li><li>Checkout with Paypal Integration</li><li>Minimal User Registration process</li><li>Order history and Password Management</li><li>Facility for Multi level Category</li><li>Mobile optimized with Bootstrap</li><li>Instant updates for any changes made across all clients with SocketIO implementation</li><li>Loads more products on scroll (No paging required)</li><li>Clean and responsive user interface</li></ul><h3>### Store Back Office Features</h3><ul><li>Products, Categories, Brand, Order Management from admin panel with easy directives</li><li>Manage Order and Change Status from admin panel</li><li>Facility for Multiple product variants (size, color, price, image)</li><li>User roles - Administrator, User, Guest</li><li>SEO friendly URLs for each page</li><li>Secure and quality code - Takes care all single page web app standards</li><li>Securely built and prevent security attacks</li></ul></div></div><!-- /.col-md-9 --><!-- **LEFT COLUMN END *** --><div class=col-md-3><!-- *** BLOG MENU ***\n" +
    "_________________________________________________________ --><div class=\"panel panel-default sidebar-menu\"><div class=panel-heading><h3 class=panel-title>Overview</h3></div><div class=panel-body id=navbar-example><ul class=\"nav nav-pills nav-stacked\"><li class=active><a href=#live-demos>Live Demos</a></li><li><a href=#installation>Installation</a></li><li><a href=#store>Store</a></li><li><a href=#product-details>Product Details</a></li><li><a href=#shopping-cart>Shopping Cart</a></li><li><a href=#accounts-page>Accounts Page</a></li><li><a href=#orders-history>Orders History</a></li><li><a href=#add-brands>Add Brands</a></li><li><a href=#add-categories>Add Categories</a></li><li><a href=#add-products>Add Products</a></li><li><a href=#manage-users>Manage Users</a></li><li><a href=#features>Features</a></li></ul></div></div></div><!-- /.col-md-9 -->"
  );


  $templateCache.put('app/feature/feature.html',
    "<div class=col-md-12><crud-table api=Feature cols=[{&quot;key&quot;:&quot;text&quot;},{&quot;val&quot;:&quot;text&quot;},{&quot;active&quot;:&quot;boolean&quot;}]></crud-table></div>"
  );


  $templateCache.put('app/inventory/inventory.html',
    "<div class=container><div class=row><div class=col-sm-12><h1></h1></div></div><div class=row><div class=col-lg-12><ul class=\"nav nav-tabs nav-stacked col-md-4 col-lg-4 col-sm-6\" ng-repeat=\"thing in awesomeThings\"><li><a href=# tooltip={{thing.info}}>{{thing.name}} <button type=button class=close ng-click=deleteThing(thing)>&times;</button></a></li></ul><ul class=\"nav nav-tabs nav-stacked col-md-4 col-lg-4 col-sm-6\" ng-repeat=\"product in products\"><li><a href=# tooltip={{product.info}} ng-click=editProduct(product)>{{product.name}} <button type=button class=close ng-click=deleteProduct(product.name,product)>&times;</button></a></li></ul></div></div><form class=product-form><label>Syncs in realtime across clients</label><p class=input-group><input class=form-control placeholder=Name ng-model=product.name> <input class=form-control placeholder=SKU ng-model=product.sku> <input class=form-control placeholder=SKU ng-model=product.category> <span class=input-group-btn><button type=submit class=\"btn btn-primary\" ng-click=addProduct()>Add New</button></span></p></form></div>"
  );


  $templateCache.put('app/invoice/invoice.html',
    "<div class=col-md-12>This is the invoice view.</div>"
  );


  $templateCache.put('app/main/main.html',
    "<link rel=stylesheet href=\"bower_components/angular-loading/angular-loading.css\"><div class=col-md-12><ul class=breadcrumb><li><a ui-sref=main href=\"\">Home</a></li><li ng-repeat=\"b in breadcrumb.items | reverse\"><a href=\"/\" ng-if=!$last>{{b.name}}</a> <span ng-if=$last>{{b.name}}</span></li></ul></div><div class=col-md-3><!--<div class=\"panel panel-default sidebar-menu\">\n" +
    "\n" +
    "        <div class=\"panel-heading\">\n" +
    "             <h3 class=\"panel-title\">Price Range <a class=\"btn btn-xs btn-danger pull-right\" href=\"\" ng-click=\"resetPriceRange();\"><i class=\"fa fa-times-circle\"></i> Reset</a></h3>\n" +
    "         </div>\n" +
    "\n" +
    "         <div class=\"panel-body\">\n" +
    "\n" +
    "             <form>\n" +
    "                 <div class=\"form-group\">\n" +
    "                   <rzslider\n" +
    "                     rz-slider-floor=\"priceSlider.floor\"\n" +
    "                     rz-slider-ceil=\"priceSlider.ceil\"\n" +
    "                     rz-slider-model=\"priceSlider.min\"\n" +
    "                     rz-slider-high=\"priceSlider.max\"\n" +
    "                     rz-slider-translate=\"currencyFormatting\"\n" +
    "                     rz-slider-on-end=\"filter()\"></rzslider>\n" +
    "\n" +
    "                    $<strong>{{priceSlider.min}}</strong> &nbsp;-&nbsp; $<strong>{{priceSlider.max}}</strong>\n" +
    "                 </div>\n" +
    "\n" +
    "             </form>\n" +
    "\n" +
    "         </div>\n" +
    "      </div>--><!--<div class=\"panel panel-default sidebar-menu\">\n" +
    "\n" +
    "          <div class=\"panel-heading\">\n" +
    "              <h3 class=\"panel-title\">\n" +
    "                <div class=\"nav-search\" id=\"nav-search\">\n" +
    "                        <span class=\"input-icon\">\n" +
    "                            <input placeholder=\"Filter Technologies\" class=\"nav-search-input\" ng-model=\"filterBrand\" autocomplete=\"off\" type=\"text\" autofocus style=\"width:100%\">\n" +
    "                            <i class=\"search-icon fa fa-search nav-search-icon\"></i>\n" +
    "                        </span>\n" +
    "                </div>\n" +
    "              </h3>\n" +
    "          </div>\n" +
    "\n" +
    "          <div class=\"panel-body brand-filter-panel\">\n" +
    "\n" +
    "              <form>\n" +
    "                  <div class=\"form-group\">\n" +
    "                      <div class=\"checkbox\" ng-repeat=\"b in brands | filter:filterBrand\">\n" +
    "                          <label>\n" +
    "                            <input type=\"checkbox\" value=\"{{b.name}}\" checklist-model=\"fl.brands\" checklist-value=\"b\" ng-click=\"filter();\" />\n" +
    "                            {{b.name}}<span>&nbsp;</span>\n" +
    "                          </label>\n" +
    "                      </div>\n" +
    "                  </div>\n" +
    "\n" +
    "<a class=\"btn btn-xs btn-warning pull-right\" href=\"\" ng-repeat=\"b in fl.brands\" ng-click=\"removeBrand(b);\" style=\"margin:0 0 5px 5px;\"><i class=\"fa fa-times-circle\"></i> {{b.name}}</a>\n" +
    "              </form>\n" +
    "\n" +
    "          </div>\n" +
    "      </div>--><div class=\"panel panel-default sidebar-menu\"><div class=panel-heading><h3 class=panel-title><div class=nav-search id=nav-search><span class=input-icon><input placeholder=\"Filter Technologies ...\" class=nav-search-input ng-model=filterFeature autocomplete=off autofocus style=width:100%> <i class=\"search-icon fa fa-search nav-search-icon\"></i></span></div></h3></div><div class=panel-body><form><div class=form-group><div ng-repeat=\"k in features | filter:filterFeature\"><h4>{{k.key}}</h4><div class=checkbox ng-repeat=\"f in k.v\"><label><input type=checkbox value={{f}} checklist-model=fl.features[k.key] checklist-value=f ng-click=\"filter();\"> {{f}}<span>&nbsp;</span></label></div></div></div></form></div></div></div><div class=col-md-9><div class=\"box info-bar\"><div class=row><div class=\"col-sm-12 col-md-5 products-showing\">Showing {{products.items.length}} people out of {{products.count}}.<!--$<strong>{{priceSlider.min}}</strong> &nbsp;-&nbsp; $<strong>{{priceSlider.max}}</strong>--></div><div class=\"col-sm-12 col-md-7 text-right products-number-sort\"><div class=row><form class=form-inline><div class=\"col-md-12 col-sm-12\"><div class=products-number><strong>Sort</strong><div class=btn-group><a href=\"\" ng-repeat=\"o in sortOptions\" ng-class=\"{active : o.val==products.sort}\" class=\"btn btn-default btn-sm btn-primary\" ng-click=sortNow(o.val);>{{o.name}}</a></div></div></div></form></div></div><div class=\"col-sm-12 col-md-8 products-number-sort\"><div class=products-sort-by><span ng-if=\"fl.brands.length>0\">Technologies:</span> <a class=\"btn btn-xs btn-warning\" href=\"\" ng-click=removeBrand(b); ng-repeat=\"b in fl.brands\" style=margin-left:5px><i class=\"fa fa-times-circle\"></i> {{b.name}}</a> <a ng-if=\"fl.categories.length>0\" class=\"btn btn-xs btn-warning\" href=\"\" ng-click=removeCategory(); style=margin-left:5px><i class=\"fa fa-times-circle\"></i>{{fl.categories[0].name}}</a> <span ng-repeat=\"features in fl.features\"><a ng-if=features ng-click=removeFeatures(features); ng-repeat=\"f in features\" class=\"btn btn-xs btn-warning\" href=\"\" style=margin-left:5px>{{f}}</a></span><!-- <select ng-model=\"products.brand\"  ng-change=\"navigate('Brand',products.brand);\" ng-options=\"b.name for b in brands track by b._id\" class=\"pull-right\">\n" +
    "                                      <option value=\"\">All Brands</option>\n" +
    "                                  </select> --></div></div></div></div><div infinite-scroll=scroll() infinite-scroll-disabled=products.busy infinite-scroll-distance=10><div class=\"row products\" dw-loading=products dw-loading-options=\"{text: ''}\"><div class=box ng-if=\"products.items.length==0\"><div class=row><div class=col-sm-12><h3>No person found. Try removing some filters.</h3></div></div></div><div class=col-md-12><div class=\"panel panel-primary\"><div class=panel-heading>List of people<!--<div class=\"sw-search\" >\n" +
    "                                    <div class=\"nav-search\" id=\"nav-search\">\n" +
    "                                            <span class=\"input-icon\">\n" +
    "                                                <input placeholder=\"Filter products list ...\" class=\"nav-search-input\" ng-model=\"filter\" autocomplete=\"off\" type=\"text\" autofocus>\n" +
    "                                                <i class=\"search-icon fa fa-search nav-search-icon\"></i>\n" +
    "                                            </span>\n" +
    "                                    </div>\n" +
    "                                </div>--></div><div class=panel-body><div infinite-scroll=loadMore()><table class=\"table table-striped table-responsive\" ts-wrapper><thead><tr><th ts-criteria=id>ID</th><th ts-criteria=name>Name</th><th ts-criteria=active>Percentage</th><th ts-criteria=active>Shortlist</th></tr></thead><tbody><tr ng-repeat=\"p in products.items\" id={{p._id}} animate-on-change=p.price+p.quantity+p.packing+p.name ng-animate=\"'animate'\" ts-repeat><!-- <td><img src=\"images/{{p.category}}/{{p.image}}\"/> </td>--><td>{{$index+1}}</td><td><a ui-sref=\"productDetail({id:p._id, slug:p.slug})\">{{p.name}}</a></td><td><p class=price><del ng-if=\"p.variants[0].price!=p.variants[0].mrp\">{{p.variants[0].mrp}}</del> {{p.variants[0].price}}</p></td><td><a ng-click=\"\" ng-show=checkCart(p._id) class=\"btn btn-primary\"><i class=\"fa fa-list\"></i>Shortlist</a></td></tr></tbody></table></div><!-- Infinite Scroll --></div></div></div><!-- <div class=\"col-md-12 col-sm-12\" ng-repeat=\"product in products.items\">\n" +
    "                            <div class=\"product\">\n" +
    "                                div class=\"flip-container\">\n" +
    "                                    <div class=\"flipper\">\n" +
    "                                        <div class=\"front\">\n" +
    "                                            <a ui-sref=\"productDetail({id:product._id, slug:product.slug})\">\n" +
    "                                                <img ng-src=\"/assets/clothing/{{product.variants[0].image}}\"\n" +
    "                                                    err-src=\"/assets/images/photo.png\"\n" +
    "                                                    alt=\"{{product.name}}\" class=\"img-responsive\">\n" +
    "                                            </a>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"back\">\n" +
    "                                            <a ui-sref=\"productDetail({id:product._id, slug:product.slug})\">\n" +
    "                                                <img ng-src=\"/assets/clothing/{{product.variants[0].image}}\"\n" +
    "                                                    err-src=\"/assets/images/photo.png\"\n" +
    "                                                    alt=\"{{product.name}}\" class=\"img-responsive\">\n" +
    "                                            </a>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <a ui-sref=\"productDetail({id:product._id, slug:product.slug})\" class=\"invisible\">\n" +
    "                                    <img src=\"/assets/clothing/{{product.variants[0].image}}\" alt=\"\" class=\"img-responsive\">\n" +
    "                                </a>\n" +
    "                                <div class=\"text text-center\">\n" +
    "                                    <h3><a ui-sref=\"productDetail({id:product._id, slug:product.slug})\">{{product.name}}<!--{{product.variants[0].size}}--><!--<p class=\"price\"><del ng-if=\"product.variants[0].price!=product.variants[0].mrp\">{{product.variants[0].mrp | currency : '$'}}</del> {{product.variants[0].price | currency : '$'}}</p>--><!--  <p class=\"buttons\">\n" +
    "                                      <div class=\"btn-group\">\n" +
    "                                      <a ui-sref=\"productDetail({id:product._id, slug:product.slug})\" class=\"btn btn-default\">View detail</a>\n" +
    "                                      <a ng-click=\"cart.addItem(product._id, product.name, product.slug, product.variants[0].mrp, product.variants[0].price, -1)\" ng-hide=\"checkCart(product._id)\" class=\"btn btn-info\">-</a>\n" +
    "\n" +
    "                                      <a ng-hide=\"checkCart(product._id)\" class=\"btn btn-info\">{{getQuantity(product._id);}}</a>\n" +
    "\n" +
    "                                      <a ng-click=\"cart.addItem(product._id, product.name, product.slug, product.variants[0].mrp, product.variants[0].price, +1)\" ng-hide=\"checkCart(product._id)\" class=\"btn btn-info\">+</a>\n" +
    "                                      </div>\n" +
    "                                      <a ng-click=\"\" ng-show=\"checkCart(product._id)\" class=\"btn btn-primary\"><i class=\"fa fa-list\"></i>Shortlist</a>\n" +
    "                                    </p>\n" +
    "                                </div>\n" +
    "                                <!-- /.text -\n" +
    "                            </div>\n" +
    "                            <!-- /.product --\n" +
    "                        </div>\n" +
    "\n" +
    "                        <!-- /.col-md-4 --\n" +
    "                    </div>\n" +
    "                    <!-- /.products --></div><!-- /.col-md-9 --></div><!-- /just to enable infinite scroll --></div>"
  );


  $templateCache.put('app/main/product-details.html',
    "<div class=container><div class=row><div class=\"col-sm-12 text-center\"><ol class=breadcrumb><li><a ui-sref=main href=\"\">Home</a></li><li ng-repeat=\"b in breadcrumb.items | reverse\"><a href=\"/\" ng-if=!$last>{{b.name}}</a> <span ng-if=$last>{{b.name}}</span></li></ol></div><hr class=\"clearfix\"></div></div><div class=container><div class=row><!--<div class=\"col-md-3\">\n" +
    "          <!-- *** MENUS AND FILTERS ***\n" +
    "_________________________________________________________ --><!--<div class=\"panel panel-default sidebar-menu\">\n" +
    "\n" +
    "              <div class=\"panel-heading\">\n" +
    "                  <h3 class=\"panel-title\">Categories</h3>\n" +
    "              </div>\n" +
    "              <div class=\"panel-body\">\n" +
    "                  <ul class=\"nav nav-pills nav-stacked category-menu\">\n" +
    "                      <li ng-repeat= \"p in categories\">\n" +
    "                          <a href=\"category.html\">{{p.name}} <span class=\"badge pull-right\">2</span></a>\n" +
    "                          <ul>\n" +
    "                              <li ng-repeat=\"c in p.sub_categories\"><a href=\"/Category/{{c.slug}}/{{c._id}}\">{{c.name}}</a>\n" +
    "                              </li>\n" +
    "                          </ul>\n" +
    "                      </li>\n" +
    "                  </ul>\n" +
    "\n" +
    "              </div>\n" +
    "          </div>--><!-- *** MENUS AND FILTERS END *** --><!--<div class=\"banner\">\n" +
    "              <a href=\"#\">\n" +
    "                  <img src=\"/assets/img/banner.jpg\" alt=\"sales 2015\" class=\"img-responsive\">\n" +
    "              </a>\n" +
    "          </div>\n" +
    "      </div>--><div class=col-md-12><div class=row id=productMain><div class=col-sm-3><div id=mainImage><img src=/assets/clothing/{{product.variants[0].image}} err-src=/assets/images/photo.png alt={{product.name}} class=img-responsive></div><!-- <div class=\"ribbon sale\">\n" +
    "                      <div class=\"theribbon\">SALE</div>\n" +
    "                      <div class=\"ribbon-background\"></div>\n" +
    "                  </div>\n" +
    "                  <!-- /.ribbon --><!--  <div class=\"ribbon new\">\n" +
    "                      <div class=\"theribbon\">NEW</div>\n" +
    "                      <div class=\"ribbon-background\"></div>\n" +
    "                  </div>\n" +
    "                  <!-- /.ribbon --></div><div class=col-sm-9><div class=box><h1 class=text-center>{{product.name}}</h1><p class=goToDescription><a href=#details class=scroll-to>Scroll to details</a></p><!--<p class=\"price\"><del class=\"text-muted\" ng-if=\"product.variants[0].price!=product.variants[0].mrp\" >${{product.variants[i].mrp}}</del>&nbsp;${{product.variants[i].price}}</p>--><div class=\"text-center buttons\"><div class=\"btn-group text-center\"><!--<a href=\"/\" class=\"btn btn-default\"></a>--><!--<a ng-click=\"cart.addItem(product._id, product.name, product.slug, product.variants[0].mrp, product.variants[0].price, -1)\" ng-hide=\"checkCart(product._id)\" class=\"btn btn-primary\">-</a>--><a ng-hide=checkCart(product._id) class=\"btn btn-default\">Shortlisted</a><!--<a ng-hide=\"checkCart(product._id)\" class=\"btn btn-default\">{{getQuantity(product._id);}}</a>\n" +
    "\n" +
    "                        <a ng-click=\"cart.addItem(product._id, product.name, product.slug, product.variants[0].mrp, product.variants[0].price, +1)\" ng-hide=\"checkCart(product._id)\" class=\"btn btn-primary\">+</a>\n" +
    "                        </div>--> <a ng-click=\"cart.addItem(product._id, product.name, product.slug, product.variants[0].mrp, product.variants[0].price, 1, product.variants[0].image,product.category, product.variants[0].size ,true);\" ng-show=checkCart(product._id) class=\"btn btn-primary\"><i class=\"fa fa-shopping-cart\"></i>Shortlist</a></div></div></div><div class=row id=thumbs><div class=col-xs-4 ng-repeat=\"v in product.variants\" ng-click=changeIndex($index); ng-if=\"v.size!=product.variants[i].size\"><a href=\"\" class=thumb><img src=/assets/clothing/{{v.image}} err-src=/assets/images/photo.png alt={{product.name}} class=img-responsive> {{product.name}}<p class=price><del class=text-muted ng-if=\"v.price!=v.mrp\">${{v.mrp}}</del></p></a></div></div><div><div class=box id=details><p><div ng-if=product.info><h4>Details</h4><p>{{product.info}}</p></div><!--<div ng-if=\"product.brand\">\n" +
    "                  <h4>Technologies</h4>\n" +
    "                  <ul>\n" +
    "                      <li><a href=\"/Brand/{{product.brand.name}}/{{product.brand._id}}\">{{product.brand.name}}</a></li>\n" +
    "                  </ul>\n" +
    "                  </div>--><div ng-if=product.category><h4>Domain</h4><ul><li><a href=/Category/{{product.category.slug}}/{{product.category._id}}>{{product.category.name}}</a></li></ul></div><!-- <div ng-if=\"product.variants[i]\">\n" +
    "                  <h4>Weight</h4>\n" +
    "                  <ul>\n" +
    "                      <li>{{product.variants[i].weight}}</a></li>\n" +
    "                  </ul>\n" +
    "                  </div>--><div ng-if=\"product.features.length>0\"><h4>Features</h4><ul><li ng-repeat=\"f in product.features\">{{f.key}} : {{f.val}}</li></ul></div><div ng-if=\"product.keyFeatures.length>0\"><h4>Technologies</h4><ul><li ng-repeat=\"f in product.keyFeatures\">{{f}}</li></ul></div><blockquote><p>brilliant student</p></blockquote><hr><!--<div class=\"social\">\n" +
    "                      <h4>Show it to your friends</h4>\n" +
    "                      <p>\n" +
    "                          <a href=\"https://www.facebook.com/codenx2\" class=\"external facebook\" data-animate-hover=\"pulse\"><i class=\"fa fa-facebook\"></i></a>\n" +
    "                          <a href=\"#\" class=\"external gplus\" data-animate-hover=\"pulse\"><i class=\"fa fa-google-plus\"></i></a>\n" +
    "                          <a href=\"https://twitter.com/itswadesh\" class=\"external twitter\" data-animate-hover=\"pulse\"><i class=\"fa fa-twitter\"></i></a>\n" +
    "                          <a href=\"#\" class=\"email\" data-animate-hover=\"pulse\"><i class=\"fa fa-envelope\"></i></a>\n" +
    "                      </p>\n" +
    "                  </div>--></p></div></div></div></div></div></div></div>"
  );


  $templateCache.put('app/order/order.html',
    "<div class=col-md-12><div class=box><div class=row><div class=col-md-12><h1>Orders History</h1><h3 class=\"bg-info well text-center\">Total Spent: {{orders.total | currency}}</h3><div class=\"panel panel-primary\" ng-repeat=\"o in orders | orderBy : 'orderDate' : 'reverse'\"><div class=panel-heading><div class=panel-title><button class=\"btn btn-warning\">{{o.orderNo}}</button>&nbsp;{{o.orderDate | amCalendar}}<div class=\"col-sm-3 pull-right\" ng-if=isAdmin()><select ng-model=o.status ng-options=\"i.name for i in orderStatusLov track by i.val\" ng-change=changeStatus(o) class=form-control></select></div></div></div><div class=panel-body><table class=table><tbody><tr ng-repeat=\"i in o.items\"><td><img ng-src=/assets/clothing/{{i.image}} err-src=/assets/images/photo.png width=\"100px\"></td><td>{{i.name}}<br><span class=text-muted>Qty: {{i.quantity}}</span><br><span class=text-muted>Packing: {{i.packing}}</span><br><span class=text-muted>Unit Price: {{i.price | currency}}</span></td><td><span class=text-muted>= {{i.quantity * i.price | currency}}</span></td></tr><tr class=well><td colspan=1></td><td class=text-right>Order Total:</td><td colspan=1>{{o.subTotal | currency}}</td></tr></tbody></table></div></div></div></div></div></div>"
  );


  $templateCache.put('app/paymentMethod/paymentMethod.html',
    "<div class=col-md-12><crud-table api=PaymentMethods cols=[{&quot;name&quot;:&quot;text&quot;},{&quot;email&quot;:&quot;text&quot;},{&quot;active&quot;:&quot;boolean&quot;}] nodelete=true noadd=true disabledcolumn=name></crud-table></div><!-- <div class=\"row\">\n" +
    "    <div class=\"col-md-3\"></div>\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <div class=\"box\">\n" +
    "            <h1>Payment Options</h1>\n" +
    "      <form class=\"form\" name=\"paymentForm\" ng-submit=\"savePaymentMethod(payment)\" novalidate>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "          <label>Paypal Email ID</label>\n" +
    "\n" +
    "          <input type=\"text\" name=\"paypal\" class=\"form-control\" ng-model=\"payment.paypal\"\n" +
    "                 mongoose-error placeholder=\"Paypal Email\" required/>\n" +
    "                 <input type=\"checkbox\" name=\"cod\" ng-model=\"payment.cod\"\n" +
    "                        mongoose-error placeholder=\"COD\"/>\n" +
    "          <p class=\"help-block\" ng-show=\"paymentForm.paypal.$error.mongoose\">\n" +
    "              {{ errors.other }}\n" +
    "          </p>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "          <label>Stripe publishable key</label>\n" +
    "\n" +
    "          <input type=\"text\" name=\"stripe\" class=\"form-control\" ng-model=\"payment.stripe\"\n" +
    "                 mongoose-error placeholder=\"Stripe Key\" required/>\n" +
    "          <p class=\"help-block\" ng-show=\"paymentForm.stripe.$error.mongoose\">\n" +
    "              {{ errors.other }}\n" +
    "          </p>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "          <label>Google Wallet</label>\n" +
    "\n" +
    "          <input type=\"text\" name=\"google\" class=\"form-control\" ng-model=\"payment.google\"\n" +
    "                 mongoose-error placeholder=\"Google Email ID\" required/>\n" +
    "          <p class=\"help-block\" ng-show=\"paymentForm.google.$error.mongoose\">\n" +
    "              {{ errors.other }}\n" +
    "          </p>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "          <label>Cash on Delivery</label>\n" +
    "\n" +
    "          <input type=\"checkbox\" name=\"cod\" class=\"form-control\" ng-model=\"payment.cod\"\n" +
    "                 mongoose-error placeholder=\"COD\"/>\n" +
    "          <p class=\"help-block\" ng-show=\"paymentForm.cod.$error.mongoose\">\n" +
    "              {{ errors.other }}\n" +
    "          </p>\n" +
    "        </div>\n" +
    "\n" +
    "        <p class=\"help-block\"> {{ message }} </p>\n" +
    "\n" +
    "        <button class=\"btn btn-lg btn-warning\" type=\"submit\" ng-disabled=\"paymentForm.$pristine\" ng-disabled=\"paymentForm.$dirty && paymentForm.$invalid\">Save Payment Methods</button>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-3\"></div>\n" +
    "  </div> -->"
  );


  $templateCache.put('app/product/product.html',
    "<link rel=stylesheet href=\"bower_components/angular-tablesort/tablesort.css\"><form name=product_form><div class=col-sm-12><div class=box><h1>Products Manager</h1><div class=\"alert alert-info\">Shipping will be free, if no weight specified</div></div></div><div class=col-md-7><button type=button class=\"btn btn-danger\" ng-click=edit({});><i class=\"fa fa-plus\"></i>&nbsp;Add New</button> <button type=submit class=\"btn btn-info\" ng-click=save(product);><i class=\"fa fa-save\"></i> &nbsp;Save</button> &nbsp;&nbsp;<a ui-sref=\"productDetail({id:product._id, slug:product.slug})\">{{product.name}}</a><hr><div class=box ng-if=product._id><form class=form-horizontal role=form><div class=form-group><div class=col-md-12><div class=\"form-group row\"><label for=id class=\"col-md-1 control-label\">ID</label><div class=col-md-2><input ng-model=product.id disabled class=form-control placeholder=\"ID\"></div><label for=sku class=\"col-md-1 control-label\">SKU</label><div class=col-md-2><input ng-model=product.sku class=form-control placeholder=\"SKU\"></div><label for=name class=\"col-md-1 control-label text-right\">Name</label><div class=col-md-5><input ng-model=product.name class=form-control placeholder=\"Name\"></div></div><hr><div class=\"form-group row\"><label for=id class=\"col-md-2 control-label\">Category</label><div class=col-md-4><select ng-model=product.category ng-options=\"option.name for option in categories | orderBy:'name' track by option._id\" class=form-control><option value=\"\">Select Category</option></select><ui-select ng-model=product.category theme=bootstrap title=\"Select Category\"><ui-select-match placeholder=\"Select Category...\">{{$select.selected.name}}</ui-select-match><ui-select-choices repeat=\"c in categories | propsFilter: {name: $select.search}\"><span ng-bind-html=\"c.name | highlight: $select.search\"></span></ui-select-choices></ui-select></div><label for=id class=\"col-md-1 control-label\">Brand</label><div class=col-md-4><select ng-model=product.brand ng-options=\"i.name for i in brands | orderBy:'name' track by i._id\" class=form-control><option value=\"\">Select Brand</option></select><ui-select ng-model=product.brand theme=bootstrap title=\"Select Brand\"><ui-select-match placeholder=\"Select Brand...\">{{$select.selected.name}}</ui-select-match><ui-select-choices repeat=\"b in brands | propsFilter: {name: $select.search}\"><span ng-bind-html=\"b.name | highlight: $select.search\"></span></ui-select-choices></ui-select></div></div><hr><div class=\"form-group row\"><label for=id class=\"col-md-2 control-label\">Description</label><div class=col-md-12><textarea ng-model=product.info class=form-control></textarea></div></div></div></div><hr><div class=clearfix></div><div class=\"panel panel-primary\"><div class=panel-heading>Features <a href=/feature class=pull-right>Create New</a></div><div class=panel-body><table class=\"table table-striped table-responsive\"><thead><tr><th>#</th><th>Key</th><th>Value</th></tr></thead><tbody><tr ng-repeat=\"feature in product.features track by $index\"><td>{{$index+1}}</td><td><!-- <input type=\"text\" ng-model=\"feature.key\" style=\"width:150px;\" placeholder=\"Key\"/> --><select ng-model=feature.key ng-options=\"o.key as o.key for o in features | unique: 'key'\" class=form-control><option value=\"\">Select Feature Key</option></select></td><td><select ng-model=feature.val ng-options=\"o.val as o.val for o in features | unique: 'val'\" class=form-control><option value=\"\">Select Feature Value</option></select><ui-select ng-model=selected.feature[$index] theme=bootstrap title=\"Select Feature Value\" ng-init=\"selected.feature[$index] = feature\" style=\"max-width: 200px\"><ui-select-match placeholder=\"Select Feature Value...\">{{$select.selected.val}}</ui-select-match><ui-select-choices repeat=\"f in features | propsFilter: {val: $select.search}\"><span ng-bind-html=\"f.val | highlight: $select.search\"></span></ui-select-choices></ui-select><!-- <input type=\"text\" ng-model=\"feature.val\" style=\"width:150px;\" placeholder=\"Value\"/> --></td><td><div class=btn-group><button type=submit class=\"btn btn-info\" ng-click=save(product);><i class=\"fa fa-save\"></i></button> <button type=button class=\"btn btn-danger\" ng-click=deleteFeature($index,product);><i class=\"fa fa-trash-o\"></i></button></div></td></tr><tr><td>New</td><td><!-- <input type=\"text\" ng-model=\"newFeature.key\" style=\"width:150px;\" placeholder=\"Key\"/> --><select ng-model=newFeature.key ng-options=\"o.key as o.key for o in features | unique: 'key'\" class=form-control><option value=\"\">Select Feature</option></select></td><td><select ng-model=newFeature.val ng-options=\"o.val as o.val for o in features | unique: 'val'\" class=form-control><option value=\"\">Select Feature Value</option></select></td><td></td></tr></tbody></table></div></div><hr><div class=clearfix></div><div class=\"panel panel-primary\"><div class=panel-heading>Key Features</div><div class=panel-body><table class=\"table table-striped table-responsive\"><thead><tr><th>#</th><th></th></tr></thead><tbody><tr ng-repeat=\"kf in product.keyFeatures track by $index\"><td>{{$index+1}}</td><td><input ng-model=product.keyFeatures[$index] style=width:150px placeholder=\"Feature\"></td><td><div class=btn-group><button type=button class=\"btn btn-danger\" ng-click=deleteKF($index,product);><i class=\"fa fa-trash-o\"></i></button></div></td></tr><tr><td>New</td><td><input ng-model=newKF.val style=width:150px placeholder=\"Key Feature\"></td><td></td></tr></tbody></table></div></div><hr><div class=clearfix></div><div class=\"panel panel-primary\"><div class=panel-heading>Product Variants</div><div class=panel-body><table class=\"table table-striped table-responsive\"><thead><tr><th>#</th><th>Size</th><th>Weight</th><th>MRP</th><!--  ts-default --><th>Price</th><th>Image</th><th></th></tr></thead><tbody><tr ng-repeat=\"p in product.variants track by $index\" id={{p._id}}><!-- <td><img src=\"images/{{p.category}}/{{p.image}}\"/> </td>--><td>{{$index+1}}</td><td><input ng-model=p.size style=width:70px placeholder=\"Size\"></td><td><input ng-model=p.weight style=width:70px placeholder=\"Weight\"></td><td><input ng-model=p.mrp style=width:70px placeholder=\"MRP\"></td><td><input ng-model=p.price style=width:70px placeholder=\"Price\"></td><td><input ng-model=p.image style=width:150px placeholder=\"Image\"></td><td><div class=btn-group><button type=button class=\"btn btn-danger\" ng-click=deleteVariants($index,product);><i class=\"fa fa-trash-o\"></i></button></div></td></tr><tr><!-- <td><img src=\"images/{{p.category}}/{{p.image}}\"/> </td>--><td>New</td><td><input ng-model=variant.size style=width:70px placeholder=\"Size\"></td><td><input ng-model=variant.weight style=width:70px placeholder=\"Weight\"></td><td><input ng-model=variant.mrp style=width:70px placeholder=\"MRP\"></td><td><input ng-model=variant.price style=width:70px placeholder=\"Price\"></td><td><input ng-model=variant.image style=width:150px placeholder=\"Image\"></td><td></td></tr></tbody></table></div></div></form></div><div class=box ng-if=!product._id><h3>Click on the product name to view details... <i class=\"fa fa-arrow-right\"></i></h3></div></div><div class=col-md-5><div class=\"panel panel-primary\"><div class=panel-heading>List of products<div class=sw-search><div class=nav-search id=nav-search><span class=input-icon><input placeholder=\"Filter products list ...\" class=nav-search-input ng-model=filter autocomplete=off autofocus> <i class=\"search-icon fa fa-search nav-search-icon\"></i></span></div></div></div><div class=panel-body><div infinite-scroll=loadMore()><table class=\"table table-striped table-responsive\" ts-wrapper><thead><tr><th ts-criteria=id>ID</th><th ts-criteria=name>Name</th><th ts-criteria=active>Status</th></tr></thead><tbody><tr ng-repeat=\"p in products | filter:filter\" id={{p._id}} animate-on-change=p.price+p.quantity+p.packing+p.name ng-animate=\"'animate'\" ts-repeat><!-- <td><img src=\"images/{{p.category}}/{{p.image}}\"/> </td>--><td>{{$index+1}}</td><td><a href=\"\" ng-click=productDetail(p);>{{p.name}}</a></td><td><button class=btn ng-class=\"{true:'btn-success', false:''}[p.active]\" ng-click=changeActive(p);>{{p.active | active}}</button></td></tr></tbody></table></div><!-- Infinite Scroll --></div></div></div></form>"
  );


  $templateCache.put('app/shipping/shipping.html',
    "<div class=col-md-12><div class=row><div class=box><h3>Shipping Settings</h3><div class=alert-info>Weight is always in grams. Please enter stripped out version. e.g.: 100 instead of 100g or 100kg</div></div></div></div><crud-table api=Shipping cols=[{&quot;carrier&quot;:&quot;text&quot;},{&quot;country&quot;:&quot;text&quot;},{&quot;charge&quot;:&quot;currency&quot;},{&quot;minWeight&quot;:&quot;number&quot;},{&quot;maxWeight&quot;:&quot;number&quot;},{&quot;minOrderValue&quot;:&quot;currency&quot;},{&quot;active&quot;:&quot;boolean&quot;}]></crud-table><!-- <div class=\"col-md-12\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"box\">\n" +
    "          <form class=\"form\" name=\"shippingForm\" ng-submit=\"saveSettings(settings)\" novalidate>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <label>Free shipping on minimum order value of </label>\n" +
    "        <input type=\"text\" name=\"shipping\" class=\"form-control\" ng-model=\"settings.minOrderValue\"\n" +
    "               mongoose-error placeholder=\"Minimum Order Value\" required/>\n" +
    "        <p class=\"help-block\" ng-show=\"shippingForm.shipping.$error.mongoose\">\n" +
    "            {{ errors.other }}\n" +
    "        </p>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "          <label>Shipping Charge</label>\n" +
    "          <input type=\"text\" name=\"shippingCharge\" class=\"form-control\" ng-model=\"settings.shippingCharge\"\n" +
    "                 mongoose-error placeholder=\"Charge\" required/>\n" +
    "          <p class=\"help-block\" ng-show=\"shippingForm.shippingCharge.$error.mongoose\">\n" +
    "              {{ errors.other }}\n" +
    "          </p>\n" +
    "        </div>\n" +
    "\n" +
    "        <p class=\"help-block\"> {{ message }} </p>\n" +
    "\n" +
    "        <button class=\"btn btn-lg btn-warning\" type=\"submit\" ng-disabled=\"shippingForm.$pristine\" ng-disabled=\"shippingForm.$dirty && shippingForm.$invalid\">Save Shipping Settings</button>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div> -->"
  );


  $templateCache.put('app/shop/shop.html',
    "<div class=col-md-12>This is the shop view.</div>"
  );


  $templateCache.put('components/modal/modal.html',
    "<div class=modal-header><button type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=options.title ng-bind=options.title class=modal-title></h4></div><form name=modal-form class=form-horizontal role=form novalidate><div class=modal-body><p ng-if=options.body ng-bind=options.body></p><div class=form-group ng-repeat=\"i in options.columns\" ng-if=options.columns><label class=\"col-sm-3 control-label no-padding-right\">{{i.heading | labelCase}}</label><div class=col-sm-7><span class=\"block input-icon input-icon-right\"><input class=form-control name=name ng-model=data[i.heading] ng-disabled=\"i.heading=='_id' || (i.heading==options.disabledColumn && options.title==='Add New')\" autofocus placeholder=\"{{i.heading | labelCase}}\" ng-if=\"i.sortType==='parseFloat'\" only-numbers> <input class=form-control name=name ng-model=data[i.heading] ng-disabled=\"i.heading=='_id' || (i.heading==options.disabledColumn && data._id)\" autofocus placeholder=\"{{i.heading | labelCase}}\" ng-if=\"i.sortType!=='parseFloat' && i.dataType!=='boolean'\"> <input type=checkbox ng-model=data[i.heading] ng-if=\"i.dataType==='boolean'\" class=form-control></span></div></div><div class=form-group ng-repeat=\"(i, name) in data track by $index\" ng-if=!options.columns><label class=\"col-sm-3 control-label no-padding-right\">{{i}}</label><div class=col-sm-7><span class=\"block input-icon input-icon-right\"><input class=form-control name=name ng-model=data[i] ng-disabled=\"i=='_id'\" autofocus></span></div></div></div><div class=modal-footer><!-- <button ng-repeat=\"button in options.buttons\" ng-class=\"button.classes\" ng-click=\"button.click($event)\" ng-bind=\"button.text\" class=\"btn\"></button> --><!-- <button type=\"button\" class=\"btn\" ng-click=\"cancel();\">Cancel</button> --><button class=\"btn btn-primary\" ng-click=saveItem(data); type=submit>Save</button></div></form>"
  );


  $templateCache.put('components/navbar/navbar.html',
    "<div ng-controller=NavbarCtrl><!-- *** TOPBAR ***\n" +
    "_________________________________________________________ --><div id=top><div class=container><div class=\"col-md-3 offer\" data-animate=fadeInDown><div style=font-size:16px><strong><a href=\"/\">Tecruitr</a></strong></div></div><div class=col-md-9 data-animate=fadeInDown><ul class=menu><li ng-hide=isLoggedIn() ng-class=\"{active: isActive('/signup')}\"><a href=/signup>Sign up</a></li><li ng-hide=isLoggedIn() ng-class=\"{active: isActive('/login')}\"><a href=/login>Login</a></li><li ng-show=isLoggedIn()><a href=\"/\">Leaderboard</a></li><li ng-show=isLoggedIn()><a href=\"\">Hello {{ getCurrentUser().name }}</a></li><li class=dropdown ng-show=isLoggedIn() dropdown=\"\"><a href=# dropdown-toggle=\"\" class=dropdown-toggle data-toggle=dropdown><i class=\"fa fa-dashboard\">&nbsp;</i>Account<b class=caret></b></a><ul class=dropdown-menu role=menu><li ng-show=isAdmin() ng-class=\"{active: isActive('/product')}\"><a href=/product><i class=\"fa fa-truck\">&nbsp;</i>Products</a></li><li ng-show=isAdmin() ng-class=\"{active: isActive('/category')}\"><a href=/category><i class=\"fa fa-ticket\">&nbsp;</i>Categories</a></li><li ng-show=isAdmin() ng-class=\"{active: isActive('/brand')}\"><a href=/brand><i class=\"fa fa-tag\">&nbsp;</i>Brands</a></li><li ng-show=isAdmin() ng-class=\"{active: isActive('/feature')}\"><a href=/feature><i class=\"fa fa-tag\">&nbsp;</i>Features</a></li><li ng-show=isAdmin() ng-class=\"{active: isActive('/coupon')}\"><a href=/coupon><i class=\"fa fa-tag\">&nbsp;</i>Coupons</a></li><li ng-show=isAdmin() ng-class=\"{active: isActive('/order')}\"><a href=/order><i class=\"fa fa-road\">&nbsp;</i>Orders</a></li><li class=divider></li><li ng-show=isAdmin() ng-class=\"{active: isActive('/admin')}\"><a href=/admin><i class=\"fa fa-user\">&nbsp;</i>Shop Settings</a></li><li ng-show=isAdmin() ng-class=\"{active: isActive('/customer')}\"><a href=/customer><i class=\"fa fa-user\">&nbsp;</i>Customers</a></li><li ng-show=isAdmin() ng-class=\"{active: isActive('/paymentMethod')}\"><a href=/paymentMethod><i class=\"fa fa-wrench\">&nbsp;</i>Payment Method</a></li><li ng-show=isAdmin() ng-class=\"{active: isActive('/shipping')}\"><a href=/shipping><i class=\"fa fa-wrench\">&nbsp;</i>Shipping Settings</a></li><li ng-show=isLoggedIn() ng-class=\"{active: isActive('/logout')}\"><a href=\"\" ng-click=logout()><i class=\"fa fa-sign-out\">&nbsp;</i>Logout</a></li><li class=divider></li></ul></li><li><a href=/contact>Contact</a></li><li ng-show=isLoggedIn()><a href=/calender>Calender</a></li><li ng-show=isLoggedIn()><a href=/tests>Tests</a></li><!-- <li><a href=\"/documentation\">Documentation</a>--></ul></div></div><div class=\"modal fade\" id=login-modal tabindex=-1 role=dialog aria-labelledby=Login aria-hidden=true><div class=\"modal-dialog modal-sm\"><div class=modal-content><div class=modal-header><button type=button class=close data-dismiss=modal aria-hidden=true>&times;</button><h4 class=modal-title id=Login>Customer login</h4></div><div class=modal-body><form action=customer-orders.html method=post><div class=form-group><input class=form-control id=email-modal placeholder=email></div><div class=form-group><input type=password class=form-control id=password-modal placeholder=password></div><p class=text-center><button class=\"btn btn-primary\"><i class=\"fa fa-sign-in\"></i> Log in</button></p></form><p class=\"text-center text-muted\">Not registered yet?</p><p class=\"text-center text-muted\"><a href=register.html><strong>Register now</strong></a>! It is easy and done in 1&nbsp;minute and gives you access to special discounts and much more!</p></div></div></div></div></div><!-- *** TOP BAR END *** --><!-- *** NAVBAR ***\n" +
    "_________________________________________________________ --><div class=\"navbar navbar-default yamm\" role=navigation id=navbar><div class=container><div class=col-md-12><div class=navbar-header><!--<a class=\"navbar-brand home\" href=\"index.html\" data-animate-hover=\"bounce\">Tecruitr\n" +
    "                <!--<img src=\"/assets/img/logo.gif\" alt=\"CodeNx logo\" class=\"hidden-xs\">\n" +
    "                <img src=\"/assets/img/logo.gif\" alt=\"CodeNx logo\" class=\"visible-xs\"><span class=\"sr-only\">Tecruitr- go to homepage</span>\n" +
    "            </a>--><div class=navbar-buttons><button type=button class=navbar-toggle data-toggle=collapse data-target=#navigation ng-click=\"isCollapsed1 = !isCollapsed1\"><span class=sr-only>Toggle navigation</span> <i class=\"fa fa-align-justify\"></i></button><!-- <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#search\">\n" +
    "                    <span class=\"sr-only\">Toggle search</span>\n" +
    "                    <i class=\"fa fa-search\"></i>\n" +
    "                </button>--> <a class=\"btn btn-default navbar-toggle\" ng-click=\"openCart(cart,'lg');\" href=\"\"><i class=\"fa fa-list\">&nbsp;</i> <span class=hidden-xs>Shortlist({{cart.getTotalCount()}})<!--- {{cart.getTotalPrice() | currency:\"$\"}}--></span></a></div></div><!--/.navbar-header --><div class=\"navbar-collapse collapse navbar-static-top megamenu\" id=navigation><div collapse=isCollapsed1 class=\"navbar-collapse collapse\" id=navbar-main2><ul class=\"nav navbar-nav navbar-left\"><li class=\"dropdown yamm-fw\" ng-repeat=\"p in categories\"><a href=# class=dropdown-toggle data-toggle=dropdown data-hover=dropdown data-delay=200>{{p.name}} <b class=caret></b></a><ul class=dropdown-menu><li><div class=yamm-content><div class=row><div class=col-sm-3 ng-repeat=\"c in p.sub_categories\"><!-- <h5>All</h5> --><ul><li><a href=/Category/{{c.slug}}/{{c._id}} ng-click=hideSubMenu();>{{c.name}}</a></li></ul></div></div></div><!-- /.yamm-content --></li></ul></li></ul></div></div><!--/.nav-collapse --><div class=navbar-buttons><div class=\"navbar-collapse collapse right\" id=basket-overview><a class=\"btn btn-primary navbar-btn\" ng-click=\"openCart(cart,'lg');\" href=\"\"><i class=\"fa fa-list\">&nbsp;</i> <span class=hidden-sm>Shortlist ({{cart.getTotalCount()}})<!--- {{cart.getTotalPrice() | currency:\"$\"}}--></span></a></div><!--/.nav-collapse --><!--<div class=\"navbar-collapse collapse right\" id=\"search-not-mobile\">\n" +
    "                <button type=\"button\" class=\"btn navbar-btn btn-primary\" data-toggle=\"collapse\" data-target=\"#search\">\n" +
    "                    <span class=\"sr-only\">Toggle search</span>\n" +
    "                    <i class=\"fa fa-search\"></i>\n" +
    "                </button>\n" +
    "            </div>--></div><div class=\"collapse clearfix\" id=search><form id=searchForm class=\"ng-scope ng-pristine ng-valid navbar-form\" role=search><div class=\"nav-search text-center\" id=nav-search><span class=input-icon><script type=text/ng-template id=searchTemplate.html><a><span>{{match.model.name}}</span></a></script><div class=input-group><input class=\"form-control text-left\" name=q id=q autocomplete=off placeholder=\"Search for people, technologies\" ng-model=search typeahead=\"p as p.name for p in globalSearch($viewValue)\" typeahead-loading=loadingLocations typeahead-no-results=noResults typeahead-template-url=searchTemplate.html typeahead-on-select=\"onSelectProduct($item, $model, $label)\" autofocus> <span class=input-group-btn><button type=submit class=\"btn btn-primary\"><i class=\"fa fa-search\"></i>Search</button></span></div></span></div></form><!-- <form class=\"navbar-form\" role=\"search\">\n" +
    "                <div class=\"input-group\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Search\">\n" +
    "                    <span class=\"input-group-btn\">\n" +
    "\n" +
    "  <button type=\"submit\" class=\"btn btn-primary\"><i class=\"fa fa-search\"></i></button>\n" +
    "\n" +
    "    </span>\n" +
    "                </div>\n" +
    "            </form> --></div><!--/.nav-collapse --></div><!-- /.container --></div><!-- /#navbar --></div><!-- *** NAVBAR END *** --></div>"
  );

}]);

