module.exports=function(express,bodyParser,cookieParser,rateLimit,token,bruteforce,escape,configdetails)
{
const cote=require('cote');
const multer=require('multer');


var tokengen=token.generate(16);
console.log("token generated for user"+tokengen);

const APILimiter=rateLimit({

windowMs: 5 * 60 * 1000, // 5mins window
  max: 2, // start blocking after 1 request,
  message:"Exceeded login attempts from this IP, please try again after 5mins",
  keyGenerator:function(req)
  {
    console.log(tokengen);
    return tokengen;
  }
})

const app=express();

//Below is needed to render html files in views directory via res.render
app.set('view engine','ejs');
app.set('views','./admin/views');
app.engine('html', require('ejs').renderFile);

app.use(cookieParser());

//Below is needed to use static files:css,JS and images in the directory specified
app.use(express.static(__dirname)); //current admin directory
app.use(express.static('./public')); //relative path:public directory

app.use(bodyParser.json());

app.disable('x-powered-by');

var storage = multer.diskStorage(
    {
    destination: function (request, file, callback) {
        callback(null, '../public/images/');
    },
    filename: function (request, file, callback) {
        console.log(file);
        callback(null, file.originalname)
    }
}
);

var upload = multer({ storage: storage });


const admin_product_requestor=new cote.Requester({name:"admin_product_requestor",key:"product"});
const session_checker_requestor=new cote.Requester({name:"session_checker_requestor",key:"session"});
const admin_login_requestor=new cote.Requester({name:"admin_login_requestor",key:"login"});



//-----------------------------------------------Middleware functions------------------------------------------

var sessionChecker= function sessionChecker(req,res,next)
{
//This is for checking logged-in users
console.log("session checker");
if(req.cookies.jwttoken == undefined ||req.cookies.jwttoken ==null|| req.cookies.jwttoken =="")
{
res.clearCookie('user_cookie');
res.clearCookie('jwttoken');
res.redirect('/unAuthorised');    
}
else
{
session_checker_requestor.send({type:'sessionCheck',jwttoken:req.cookies.jwttoken},function(sessionResult)
{
console.log(sessionResult);
if(sessionResult)
{
   next();
}
else
{
res.clearCookie('user_cookie');
res.clearCookie('jwttoken');
res.redirect('/unAuthorised');
}

})

}
}


app.use(function(req, res,next) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private'); //Setting the header values
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('X-Frame-Options', 'deny');
  res.header('X-Content-Type-Options', 'nosniff');
  next();
})

app.use(['/loginStatus','/getProducts','/createProduct','/editProduct','/deleteProduct','/editImage'],sessionChecker);

//-----------------------------------------------Routes--------------------------------------------------------

app.post('/login',bruteforce.getMiddleware({
    key: function(req, res, next) {
        // prevent too many attempts for the same username
        next(escape(req.body[0].username));
    }
}),function(req,res,next)
{

admin_login_requestor.send(
{type:'loginRequest',
username:escape(req.body[0].username),
password:escape(req.body[0].password),role:"admin"},function(err,loginresult)
{
if(err)
{
//if catch block executed
next(err); //calling default error handler
}
else
{
console.log(loginresult);
if(loginresult.result)
{
   req.brute.reset(function () { 
    res.clearCookie('jwttoken');
    res.clearCookie('user_cookie');
    res.cookie('jwttoken',loginresult.token,{httpOnly:true}); 
    res.cookie('user_cookie',escape(req.body[0].username));
    res.send({login:true,user:escape(req.body[0].username)});
   })
    
}
else
{
   res.clearCookie('user_cookie');
   res.clearCookie('jwttoken');
   res.send({login:false,user:""}); 
}
}
})

})


app.get('/loginStatus',function(req,res)
{
res.send({sessionCheck:true});
})

app.get('/hello',APILimiter,function(req,res)
{
    res.send(req.rateLimit);
})


app.get('/getProducts',function(req,res,next)
{
admin_product_requestor.send({type:'list'},function(err,products)
{
if(err)
{
//if catch block executed
next(err); //calling default error handler
}
else
{
res.send({result:products,sessionCheck:true});
}
})
})

app.post('/createProduct',function(req,res,next)
{

req.body[0].gtin=escape(req.body[0].gtin);
req.body[0].name=escape(req.body[0].name);
req.body[0].author=escape(req.body[0].author);
req.body[0].format=escape(req.body[0].format);
req.body[0].publisher=escape(req.body[0].publisher);
req.body[0].pages=escape(req.body[0].pages);

admin_product_requestor.send({type:'create',product:req.body[0]},function(err,products)
{
    if(err)
{
//if catch block executed
next(err); //calling default error handler
}
else
{
res.send({result:products,sessionCheck:true});
}
})

})

app.put('/editProduct',function(req,res,next)
{

req.body[0].gtin=escape(req.body[0].gtin);
req.body[0].name=escape(req.body[0].name);
req.body[0].author=escape(req.body[0].author);
req.body[0].format=escape(req.body[0].format);
req.body[0].publisher=escape(req.body[0].publisher);
req.body[0].pages=escape(req.body[0].pages);

admin_product_requestor.send({type:'edit',product:req.body[0]},function(err,editCount)
{
if(err)
{
//if catch block executed
next(err); //calling default error handler
}
else
{
res.send({result:editCount,sessionCheck:true});
}
})
})

app.delete('/deleteProduct',function(req,res,next)
{
admin_product_requestor.send({type:'delete',product:req.query.gtin14},function(err,deleteCount)
{
if(err)
{
//if catch block executed
next(err); //calling default error handler
}
else
{
res.send({result:deleteCount,sessionCheck:true});
}
})
})

app.put('/editImage',upload.array('uploads'),function(req,res,next)
{
admin_product_requestor.send(
{type:'editimage',
bookgtin:req.query.gtin,
imagename:req.query.filename},function(err,updateCount)
{
if(err)
{
//if catch block executed
next(err); //calling default error handler
}
else
{
res.send({result:updateCount,sessionCheck:true});
}
})
})

app.all('/unAuthorised',function(req,res)
{
console.log("entering the unauthorised route");
res.clearCookie('user_cookie');
res.clearCookie('jwttoken');
res.send({sessionCheck:false});
})

//Default Route in case nothing specified.
app.use(function(req, res) {

  console.log("entered default route");
  res.render('index.html');
})

//error handling function
app.use(function(err,req,res,next)
{
console.log("error handling function called");
console.log(err);
res.status(500).send({errorlog:err});
})


app.listen(configdetails.NODE_PORT_ADMIN,function()
{
    console.log("app listening on port"+configdetails.NODE_PORT_ADMIN);
})

}
