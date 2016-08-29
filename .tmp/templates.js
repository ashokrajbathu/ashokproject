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
