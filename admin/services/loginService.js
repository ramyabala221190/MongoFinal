(function()
{
'use strict';
var app=angular.module("adminapp");

app.service("loginService",loginService);

loginService.$inject=['$http','$q'];

function loginService($http,$q)
{
var loginService=this;
var deferred="";


loginService.login=function(username,password)
{
deferred=$q.defer();
$http({
url:'http://localhost:8080/login',
method:'POST',
data:[{username:username,password:password}]

    }).then(function(res)
    {
console.log(res.data);
deferred.resolve(res.data);
    }).catch(function(err)
    {
   deferred.reject(err);
    })
return deferred.promise;
}

loginService.loginStatus=function()
{
deferred=$q.defer();
console.log("loginStatus called");
$http({
url:'http://localhost:8080/loginStatus',
method:'GET'
}).then(function(res)
    {
console.log(res.data);
if(res.data.sessionCheck==true)
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
url:'http://localhost:8080/loginStatus',
method:'GET'
}).then(function(res)
    {
console.log(res.data);
if(res.data.sessionCheck==false)
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