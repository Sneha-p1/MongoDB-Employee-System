const {Schema,model}=require('mongoose')
const collect = Schema({
    name:{type:String,required:true},
    EmployeeID:{type:Number,required:true},
    position:{type:String,required:true}
})
const sample = model('sample1', collect);
module.exports= sample;