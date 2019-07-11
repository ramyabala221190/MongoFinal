(function()
{
'use strict';

var app=angular.module("userapp");

app.service("userService",userService);

userService.$inject=['$http','$q'];

function userService($http,$q)
{
var deferred="";
var userService=this;

userService.viewCartDetails=function(user)
{
deferred=$q.defer();
console.log(user);
$http(
{
url:'http://localhost:8085/checkCart',
method:"GET",
params:{user:user}
})
.then(function(res)
{
deferred.resolve(res.data);
})
.catch(function(err)
{
deferred.reject(err);
})
return deferred.promise;
}

userService.getProducts=function()
{
deferred=$q.defer();
console.log("getting products");
$http(
{
url:'http://localhost:8085/getProducts',
method:"GET"
})
.then(function(res)
{
console.log(res.data);
deferred.resolve(res.data);
})
.catch(function(err)
{
console.log(err);
deferred.reject(err);
})
return deferred.promise;
}

userService.AddtoCart=function(gtin,user)
{
deferred=$q.defer();
console.log(user);
$http(
{
url:'http://localhost:8085/addCartDetails',
method:"POST",
data:[{gtin:gtin,username:user}]
})
.then(function(res)
{
deferred.resolve(res.data);
})
.catch(function(err)
{
deferred.reject(err);
})
return deferred.promise;
}


}

})();