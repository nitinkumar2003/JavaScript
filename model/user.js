const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    fName:{type:String,default:null},
    lName:{type:String,default:null},
    email:{type:String,unique:true},
    password:{type:String},
    token:{type:String},
});
module.exports=mongoose.model("user",userSchema)