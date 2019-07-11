(function()
{
'use strict';

var app=angular.module("userapp");

app.controller("userController",userController);

userController.$inject=['userService','loginService','$state'];

function userController(userService,loginService,$state)
{
    
var userController=this;

userController.productList=[];
userController.cartDetails=[];

userController.bookAddedSuccess=false;
userController.bookAddedFailed=false;
userController.bookAddedExists=false;
userController.invalidLogin=false;
userController.ToomanyRequests=false;

userController.viewCartDetails=function()
{
userController.cartDetails=[];
userService.viewCartDetails(window.localStorage.getItem("user_cookie"))
.then(function(response)
{
if(response.sessionCheck)
{
console.log(response.result);
userController.cartDetails=response.result;
}
else
{
    console.log("unauthenticated");
    $state.go("login");
}
})
.catch(function(err)
{
    console.log(err);
    errorHandler(err.status);
})
.finally(function()
{
    console.log("finally block");
})
}

userController.getProducts=function()
{
userController.productList=[];
console.log("getting products");
userService.getProducts()
.then(function(response)
{
if(response.sessionCheck)
{
console.log(response);
userController.productList=response.result;
}
else
{
    console.log("unauthenticated");
    $state.go("login");
}
})
.catch(function(err)
{
    console.log(err);
    errorHandler(err.status);
})
.finally(function()
{
    console.log("finally block");
})

}

userController.AddtoCart=function(gtin)
{
userService.AddtoCart(gtin,window.localStorage.getItem("user_cookie"))
.then(function(response)
{
if(response.sessionCheck)
{
if(response.result > 0)
{
userController.bookAddedSuccess=true;
userController.bookAddedFailed=false;

if(userController.cartDetails.length > 0)
{
   userController.viewCartDetails(); //if the cart details alreadt displayed, incase cart is updated,refresh the details 
}
}
else if(response.result < 0)
{
    userController.bookAddedExists=true;
}
else
{
userController.bookAddedFailed=true;
userController.bookAddedSuccess=false;
}

}
else
{
    console.log("unauthenticated");
    $state.go("login");
}
})
.catch(function(err)
{
    console.log(err);
    errorHandler(err.status);
})
.finally(function()
{
    console.log("finally block");
})

}

userController.loggingIn=function(username,password)
{
userController.invalidLogin=false;
console.log("entered login function")
loginService.login(username,password)
.then(function(response)
{
console.log(response);
if(!response.login)
{
userController.invalidLogin=true;
}
else
{
$state.go("user");

}
})
.catch(function(err)
{
console.log(err);
errorHandler(err.status);
})
.finally(function()
{
    console.log("finally block");
})
}

var errorHandler=function(status)
{
console.log("controller error handler called");
if(status==500 ||status==502 ||status==504 ||status==0)
{
$state.go('error');
}
else if(status==429)
{
userController.ToomanyRequests=true;
}
}


}


})();