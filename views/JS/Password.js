function CheckPassword() 
{ 
    var pass=document.getElementById("pwd");
    console.log("here");
var passw=  /^[A-Za-z]\w{7,15}$/;
if(!pass.value.match(passw)) 
{ 
    alert('Password should meet the following criteria:7 to 15 characters which contain only characters, numeric digits, underscore and first character must be a letter')
    return false;
}
}
