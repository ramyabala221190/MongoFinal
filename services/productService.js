module.exports=function(db,ObjectId)
{
const cote=require('cote');

const product_responder=new cote.Responder({name:"product_responder",key:"product"});

//Responder routes
product_responder.on('list',function(req,cb)
{

db.collection("products").find({}).toArray()
.then(function(resp)
{
cb(null,resp);
})
.catch(function(err)
{
  console.log("caught inside inner catch block");
  cb(err,null);
}) 

})

product_responder.on('create',function(req,cb)
{

db.collection("products").insert([
{"gtin14":req.product.gtin,
"name":req.product.name,
"author":req.product.author,
"format":req.product.format,
"publisher":req.product.publisher,
"pages":req.product.pages,
"images":[]}])
.then(function(resp)
{
cb(null,resp.insertedCount);
})
.catch(function(err)
{
  console.log("caught inside inner catch block");
  cb(err,null);
})  

})

product_responder.on('edit',function(req,cb)
{

db.collection("products").update(
{"gtin14":req.product.gtin},
{$set:{
"name":req.product.name,
"author":req.product.author,
"format":req.product.format,
"publisher":req.product.publisher,
"pages":req.product.pages
}})
.then(function(resp)
{
cb(null,resp.result.n);
})
.catch(function(err)
{
  console.log("caught inside inner catch block");
  cb(err,null);
}) 


})

product_responder.on('editimage',function(req,cb)
{

db.collection("products").update(
{"gtin14":req.bookgtin},
{$set:{"images":req.imagename}})
.then(function(resp)
{
cb(null,resp.result.n);
}) 
.catch(function(err)
{
  console.log("Caught inside inner catch block");
  console.log(err);
  cb(err,null);
})   

})

product_responder.on('delete',function(req,cb)
{
db.collection("products").remove({"gtin14":req.product})
.then(function(resp)
{
cb(null,resp.result.n);
})
.catch(function(err)
{
  console.log("Caught inside inner catch block");
  console.log(err);
  cb(err,null);
})

})
}