(function()
{
'use strict';

var app=angular.module("userapp");

app.config(function routes($stateProvider,$locationProvider,$injector,$urlRouterProvider)
{
$locationProvider.html5Mode(true);

$urlRouterProvider.otherwise('/login');


$stateProvider.state('user',{
  url:'/userhome',
  //templateUrl:'views/user.html',
  //controller:'userController as userController',
  component:'userPage',
  resolve:{
status:['loginService',function(loginService)
{
return loginService.loginStatus();
}]

  }

})

.state('login',{
  url:'/login',
  //templateUrl:'views/login.html',
  //controller:'userController as userController',
  component:'loginPage',
  resolve:{
status:['loginService',function(loginService)
{
return loginService.alreadyLoggedIn();
}]
  }
})

.state('error',{
url:'/error',
component:'errorPage'
});

});

//This is needed if someone tries to open the home page without logging in
app.run(function($transitions,$state)
{
$transitions.onSuccess({ to:'user' }, function(transition) {
  window.Updateuser();
  console.log("Reached user state");
   window.hideAJAXSpinner();
});

$transitions.onStart({ to:'user' }, function(transition) {
 window.showAJAXSpinner(); 
});

$transitions.onError({ to:'user' }, function(transition) {
  console.log("Error reaching user state: " + transition.error().detail);
    if(transition.error().detail==false)
    {
      $state.go('login');
    }
    else
    {
      $state.go('error');
    }
});

$transitions.onSuccess({ to:'login' }, function(transition) {
  console.log("Reached login state");
   window.hideAJAXSpinner();
});

$transitions.onError({ to:'login' }, function(transition) {
  console.log("Error reaching login state: " + transition.error().detail);
    if(transition.error().detail==true)
    {
      $state.go('user');
    }
    else
    {
      $state.go('error');
    }
});

$transitions.onStart({ to:'login' }, function(transition) {
 window.showAJAXSpinner(); 
});

})

})();
