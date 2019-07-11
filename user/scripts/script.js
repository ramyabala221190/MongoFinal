
function Updateuser()
{
var cook=document.cookie.split(";");

for(var i=0;i<cook.length;i++)
{
if(cook[i].substring(0,cook[i].indexOf("="))=="user_cookie")
{
window.localStorage.setItem("user_cookie",cook[i].substring(cook[i].indexOf("=")+1));
}
}

if(document.getElementById('username')==null)
{
console.log("its null");
   let check=setInterval(function()
    {
        console.log("waiting");
        if(document.getElementById('username')!=null)
        {
        console.log("its not null now");
        clearInterval(check);
document.getElementById('username').innerHTML=window.localStorage.getItem("user_cookie");
        }
    },500);
}
else
{
document.getElementById('username').innerHTML=window.localStorage.getItem("user_cookie");
}


}

function showAJAXSpinner()
{
document.getElementById('loadingRequest').style.display="block";
}

function hideAJAXSpinner()
{
      document.getElementById('loadingRequest').style.display="none";
}