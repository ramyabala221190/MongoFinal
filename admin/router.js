(function()
{
'use strict';

var app=angular.module("adminapp");

app.config(function routes($stateProvider,$locationProvider,$injector,$urlRouterProvider)
{
$locationProvider.html5Mode(true);

$urlRouterProvider.otherwise('/login');

$stateProvider.state('admin',{
  url:'/adminhome',
  //templateUrl:'views/admin.html',
  component:'adminPage',
  //controller:'adminController as adminController',
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
  component:'loginPage',
  //controller:'adminController as adminController',
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
$transitions.onSuccess({ to:'admin' }, function(transition) {
    
  window.Updateuser();
  console.log("Reached admin state");
 window.hideAJAXSpinner();
});

$transitions.onStart({ to:'admin' }, function(transition) {
 window.showAJAXSpinner(); 
});

$transitions.onError({ to:'admin' }, function(transition) {
  console.log("Error reaching admin state: " + transition.error().detail);
    if(transition.error().detail==false)
    {
      $state.go('login');
    }
    else
    {
      $state.go('error');
    }
});

$transitions.onStart({ to:'login' }, function(transition) {

  console.log("Reaching login state");
   window.showAJAXSpinner(); 
});

$transitions.onSuccess({ to:'login' }, function(transition) {

  console.log("Reached login state");
   window.hideAJAXSpinner();
});

$transitions.onError({ to:'login' }, function(transition) {
  console.log("Error reaching login state: " + transition.error().detail);
    if(transition.error().detail==true)
    {
      $state.go('admin');
    }
    else
    {
      $state.go('error');
    }
});


})

})();
