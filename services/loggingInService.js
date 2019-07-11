module.exports=function(db,ObjectId,configdetails)
{
const cote=require('cote');
const fs=require('fs');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

const privateKEY  = fs.readFileSync('./public/JWTKeys/private.key', 'utf8');
const publicKEY  = fs.readFileSync('./public/JWTKeys/public.key', 'utf8');



const admin_login_responder=new cote.Responder({name:"admin_login_responder",key:"login"});
const session_checker_responder=new cote.Responder({name:"session_checker_responder",key:"session"});

//Responder routes
session_checker_responder.on('sessionCheck',function(req,cb)
{

jwt.verify(req.jwttoken, publicKEY, JSON.parse(configdetails.verifyOptions),function(err,decoded)
{
    if(err)
    {
        cb(false);
    }
    else
    {
cb(true);
    }
}) 

})

admin_login_responder.on('loginRequest',function(req,cb)
{
console.log(req);
var token="";

db.collection("users").find({"username":req.username,role:req.role}).toArray()
.then(function(resp){
if(resp.length > 0)
{
bcrypt.compare(req.password, resp[0].password)
.then(function(res) {
if(res==true)
{
token=jwt.sign({user:req.username,role:req.role},privateKEY,JSON.parse(configdetails.SignOptions));

cb(null,{token:token,result:true});
}
else
{
cb(null,{token:token,result:false})    
}
})
.catch(function(err)
{
    console.log("Caught inside bcrypt catch block");
    console.log(err);   
    cb(err,null); 
})  
}
else
{
cb(null,{token:token,result:false})
}
})
.catch(function(err)
{
  console.log("Caught inside inner catch block");
  console.log(err);
  cb(err,null); 
})

})
}

