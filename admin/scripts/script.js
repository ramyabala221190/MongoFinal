$(document).ready(function()
{
$('#editfrm').css('z-index','10');

$('#editfrm').css('box-shadow','0 0 0 9999px rgba(0,0,0,0.5)');

$('#crtfrm').css('z-index','10');

$('#crtfrm').css('box-shadow','0 0 0 9999px rgba(0,0,0,0.5)');

});

function closeModal()
{
    if(document.getElementById('editfrm') !==null)
    {
    document.getElementById('editfrm').style.display='none';
}
if(document.getElementById('crtfrm')!==null)
    {
    document.getElementById('crtfrm').style.display='none';
    }
}

function StoreFile(input)
{
var imgid=input.target.id.substring(10);
var reader=new FileReader();
reader.readAsDataURL(input.target.files[0]);
reader.onload=function()
{
$('#output'+imgid).attr('src',reader.result);
}
if(document.getElementById('book_image'+imgid).files.length > 0)
{
  document.getElementById('upload'+imgid).removeAttribute('disabled');  //enable the upload button now.
}
}

function openfileBrowser(input)
{
var inpid=input.target.id.substring(6);
document.getElementById("book_image"+inpid).click();
}

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

function HugeFileAlert()
{
    alert("File size limit is 100KB!");
}







