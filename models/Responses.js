var mongoose=require('mongoose');
var Schema=mongoose.Schema;
mongoose.Promise = global.Promise;
var ResponseSchema=new Schema({
    user:String,
    question:Array,
    response:Array
})
module.exports=mongoose.model('Response',ResponseSchema).collection;