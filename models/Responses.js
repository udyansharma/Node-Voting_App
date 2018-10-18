var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var ResponseSchema=new Schema({
    user:String,
    question:Array,
    response:Array,
    hasVoted:Boolean
})
module.exports=mongoose.model('Response',ResponseSchema);