(function()
{
'use strict';
var app=angular.module("userapp");

app.service("loginService",loginService);

loginService.$inject=['$http','$q'];

function loginService($http,$q)
{
var loginService=this;
var deferred="";


loginService.login=function(username,password)
{
deferred=$q.defer(); //please create new instance for each function
$http({
url:'http://localhost:8085/login',
method:'POST',
data:[{username:username,password:password}]

    }).then(function(res)
    {

deferred.resolve(res.data);
 }).catch(function(err)
    {
   console.log(err);
   deferred.reject(err);
    })
console.log(deferred.promise);
return deferred.promise;
}

loginService.loginStatus=function()
{
deferred=$q.defer();
console.log("loginStatus called");
$http({
url:'http://localhost:8085/loginStatus',
method:'GET'
}).then(function(res)
    {
console.log(res.data);
if(res.data.sessionCheck)
{
deferred.resolve(res.data.sessionCheck);
}
else
{
    deferred.reject(res.data.sessionCheck);
}
    }).catch(function(err)
    {
console.log(err);
    })
return deferred.promise;


}

loginService.alreadyLoggedIn=function()
{
deferred=$q.defer();
console.log("alreadyLoggedIn called");
$http({
url:'http://localhost:8085/loginStatus',
method:'GET'
}).then(function(res)
    {
console.log(res.data);
if(!res.data.sessionCheck)
{
deferred.resolve(res.data.sessionCheck);
}
else
{
    deferred.reject(res.data.sessionCheck);
}
    }).catch(function(err)
    {
console.log(err);
    })
return deferred.promise;


}



}

})();