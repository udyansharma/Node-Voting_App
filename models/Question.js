var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var QuestionSchema=new Schema({
    question:String,
    answers:[{
            con:String,
            votes:{type:Number,default:0}
    }]
})
module.exports=mongoose.model('Question',QuestionSchema);