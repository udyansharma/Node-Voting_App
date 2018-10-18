var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var UserSchema=new Schema({
    email:String,
    password:String,
    state:Boolean
})
module.exports=mongoose.model('User',UserSchema);

