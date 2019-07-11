module.exports=function(express,bodyParser,cookieParser,rateLimit,token,bruteforce,escape,configdetails)
{
const cote=require('cote');
var tokengen=token.generate(16);
console.log("token generated for user"+tokengen);

const app=express();

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

app.use(express.static(__dirname)); 
app.use(express.static('./public')); 
app.use(bodyParser.json());
app.use(cookieParser());


app.set('view engine','ejs');
app.set('views','./user/views');
app.engine('html', require('ejs').renderFile);
app.disable('x-powered-by');

const user_product_requestor=new cote.Requester({name:"user_product_requestor",key:"product"});
const user_cart_requestor=new cote.Requester({name:"user_cart_requestor",key:"cart"});
const user_login_requestor=new cote.Requester({name:"user_login_requestor",key:"login"});
const session_checking_requestor=new cote.Requester({name:"session_checking_requestor",key:"session"});

//-----------------------------------------------------------------------------------------------------------------

var sessionChecker=function(req,res,next)
{
//This is for checking logged-in users
console.log("session checker");
if(req.cookies.jwttoken == undefined)
{
res.clearCookie('user_cookie');
res.clearCookie('jwttoken');
res.redirect('/unAuthorised');    
}
else
{
session_checking_requestor.send({type:'sessionCheck',jwttoken:req.cookies.jwttoken},function(sessionResult)
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

app.use(['/loginStatus','/getProducts','/addCartDetails','/checkCart'],sessionChecker);

//------------------------------------------------------------------------------------------------------------------



app.post('/login',bruteforce.getMiddleware({
    key: function(req, res, next) {
        // prevent too many attempts for the same username
        next(escape(req.body[0].username));
    }
}),function(req,res,next)
{
console.log(req.body);
user_login_requestor.send(
{type:'loginRequest',
username:escape(req.body[0].username),
password:escape(req.body[0].password),
role:"user"},function(err,loginresult)
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
   res.clearCookie('jwttoken');
   res.clearCookie('user_cookie');
   res.send({login:false,user:""}); 
}
}
})

})

app.get('/loginStatus',function(req,res)
{
res.send({sessionCheck:true});
})

app.get('/getProducts',function(req,res,next)
{
user_product_requestor.send({type:'list'},function(err,products)
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

app.get('/hello',APILimiter,function(req,res)
{
    res.send(req.rateLimit);
})



app.post('/addCartDetails',function(req,res,next)
{
user_cart_requestor.send({type:'addCart',product:req.body[0]},function(err,insertDetails)
{
if(err)
{
//if catch block executed
next(err); //calling default error handler
}
else
{
res.send({result:insertDetails,sessionCheck:true});
}
})
})

app.get('/checkCart',function(req,res,next)
{
user_cart_requestor.send({type:'getCart',product:req.query},function(err,cartDetails)
{
if(err)
{
//if catch block executed
next(err); //calling default error handler
}
else
{
res.send({result:cartDetails,sessionCheck:true});
}
})  
})

app.all('/unAuthorised',function(req,res,next)
{
res.clearCookie('user_cookie');
res.clearCookie('jwttoken');
console.log("entering the unauthorised route");
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

app.listen(configdetails.NODE_PORT_USER,function()
{
    console.log("app listening on port"+configdetails.NODE_PORT_USER);
})

}
