const dotenv=require('dotenv').config({path: './.env'});
process.env["SignOptions"]=JSON.stringify({
issuer:'Testing',
subject:'Microservices', 
audience:'localhost', 
expiresIn:'60000',
algorithm:  'RS256',
header:{
 alg: "RS256",
 typ: "JWT"
}
})

process.env["verifyOptions"]=JSON.stringify({
      issuer:  'Testing',
      subject:  'Microservices',
      audience: 'localhost',
      expiresIn:  "60000",
      algorithms:  ["RS256"],
      complete:true
  })


module.exports=
{
NODE_PORT_ADMIN:process.env.NODE_PORT_ADMIN,
NODE_PORT_USER:process.env.NODE_PORT_USER,
MONGODB_PORT:process.env.MONGODB_PORT,
MONGODB_HOST:process.env.MONGODB_HOST,
MONGODB_DB:process.env.MONGODB_DB,
SignOptions:process.env.SignOptions,
verifyOptions:process.env.verifyOptions,
MONGOSTORE_URL:process.env.MONGOSTORE_URL,
MONGOSTORE_DB:process.env.MONGOSTORE_DB
};