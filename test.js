//General modules

const express=require('express');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const escape=require('escape-html');
const process=require('process');



//API consumption limiting modules
const rateLimit=require('express-rate-limit');

const token=require('rand-token').generator();

//Failed login attempts prevent modules
const loginBrute=require('express-brute');

//DB modules
const MongoClient=require('mongodb').MongoClient;
const MongoStore = require('express-brute-mongo');
const bson =require('bson');
const configdetails=require('./envconfig');
const ObjectId=bson.ObjectID;


const dbname=configdetails.MONGODB_DB;
const url="mongodb://"+configdetails.MONGODB_HOST+":"+configdetails.MONGODB_PORT+"/";

//Creating a connection to mongostore for keeping track of failed login attempts for same user.
const store = new MongoStore(function (ready) {
 MongoClient.connect(configdetails.MONGOSTORE_URL)
  .then(function(dbo1)
{
    store_connection=dbo1;
    ready(dbo1.db(configdetails.MONGOSTORE_DB).collection('bruteforce-store'));
})
.catch(function(err)
{
    console.log("caught in mongostore catch block");
    console.log(err);
})
});

const bruteforce = new loginBrute(store,{
    freeRetries: 1,
    minWait: 5*60*1000, // 5 minutes
    maxWait: 10*60*1000 // 10mins, 
    });

//Creating a  connection only once and using it in all services.
MongoClient.connect(url,
{
    poolSize: 5  //Set the maximum poolSize for each individual server or proxy connection.
})
.then(function(dbo)
{
client_connection=dbo;
const db = dbo.db(dbname);
require('./services/loggingInService')(db,ObjectId,configdetails);
require('./services/productService')(db,ObjectId);
require('./services/cartService')(db,ObjectId,configdetails);
require('./admin/adminComponent')(express,bodyParser,cookieParser,rateLimit,token,bruteforce,escape,configdetails);
require('./user/userComponent')(express,bodyParser,cookieParser,rateLimit,token,bruteforce,escape,configdetails);
})
.catch(function(err)
{
    console.log(err);
})

/*
Since you are requiring all services in this file, please make sure any file paths mentioned in those
services are with reference to this file.

*/

process.on('exit', function () {
    console.log("exiting");
  });

  // catch ctrl+c event and exit normally
  process.on('SIGINT', function () {
    store_connection.close();
    client_connection.close();
    console.log('Ctrl-C...');
    process.exit(2);
  });

  //catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', function(e) {
    store_connection.close();
    client_connection.close();
    
    console.log('Uncaught Exception...');
    console.log(e.stack);
    process.exit(99);
  });


