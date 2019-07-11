module.exports=function(db,ObjectId)
{
const cote=require('cote');

const cart_responder=new cote.Responder({name:'cart_responder',key:'cart'});

//Responder routes
cart_responder.on('getCart',function(req,cb)
{
var cartList=[];

db.collection("cartDetails").find({"username":req.product.user}).toArray()
.then(function(resp)
{
if(resp[0].books.length > 0)
{
console.log(resp[0].books);
for(var i=0;i<resp[0].books.length;i++)
{
db.collection("products").find({"gtin14":resp[0].books[i]}).toArray()
.then(function(bookList)
{
console.log(cartList);
cartList.push(bookList[0]);
})
.catch(function(err)
{
console.log("caught inside 1st inner catch block");
console.log(err);
cb(err,null);  
})
}
const checkCartTimer=setInterval(()=>{
if(cartList.length==resp[0].books.length)
{
clearInterval(checkCartTimer);
cb(null,cartList);
}
},1000);

}
else
{
cb(null,cartList);
}
})
.catch(function(err)
{
console.log("caught inside 2nd inner catch block");
console.log(err);
cb(err,null);  
})

})

cart_responder.on('addCart',function(req,cb)
{
var bookList=[];
var bookExists=false;
db.collection("cartDetails").find({"username":req.product.username}).toArray()
   .then(function(resp)
    {
    if(resp.length > 0)
    {
    bookList=resp[0].books;
for(var j=0;j<bookList.length;j++)
{
 if(bookList[j]==req.product.gtin)
 {
bookExists=true;
break;
 }   
}
if(bookExists==false)
{
bookList.push(req.product.gtin);
db.collection("cartDetails").update(
{"username":req.product.username},
{$set:{"books":bookList}})
.then(function(updresp)
{
cb(null,updresp.result.n);
})    
.catch(function(err)
{
console.log("caught inside 1st inner catch block");
console.log(err);
cb(err,null);  
})
}
else
{
cb(null,-1);//Book is already there in cart.
}

}
else
{
bookList.push(req.product.gtin);
db.collection("cartDetails").insert([
{"username":req.product.username,"books":bookList}])
.then(function(insresp)
{
cb(null,insresp.result.n);
})
.catch(function(err)
{
console.log("caught inside 2nd inner catch block");
console.log(err);
cb(err,null);  
})    
}

})
.catch(function(err)
{
console.log("caught inside 3rd inner catch block");
console.log(err);
cb(err,null);  
})  

})

}