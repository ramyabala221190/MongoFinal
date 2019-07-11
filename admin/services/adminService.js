(function()
{
'use strict';

var app=angular.module("adminapp");

app.service('adminService',adminService);

adminService.$inject=['$http','$q'];

function adminService($http,$q)
{
var adminService=this;
var deferred=""

adminService.creatingProduct=function(gtin,name,author,format,publisher,pages)
{
deferred=$q.defer();
$http(
{
url:'http://localhost:8080/createProduct',
method:"POST",
data:[{gtin:gtin,name:name,author:author,format:format,publisher:publisher,pages:pages}]
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

adminService.editingProduct=function(gtin,name,author,format,publisher,pages)
{
deferred=$q.defer();
$http(
{
url:'http://localhost:8080/editProduct',
method:"PUT",
data:[{gtin:gtin,name:name,author:author,format:format,publisher:publisher,pages:pages}]
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

adminService.upload=function(gtin,formdata,filename)
{
deferred=$q.defer();
$http(
{
url:'http://localhost:8080/editImage?gtin='+gtin+'&filename='+filename,
method:"PUT",
headers:{'Content-Type':undefined},
data:formdata
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

adminService.getProducts=function()
{
deferred=$q.defer();
console.log("getting products");
$http(
{
url:'http://localhost:8080/getProducts',
method:"GET"
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


adminService.deleteProducts=function(gtin14)
{
deferred=$q.defer();
$http({
method:"DELETE",
url:'http://localhost:8080/deleteProduct?gtin14='+gtin14
}).then(function(res)
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