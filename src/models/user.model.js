import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
userName: {
    type:String,
    index:true,
    required : true ,
    unique: true ,
    lowercase:true ,
    trim : true,
},
email: {
    type:String,
    required : true ,
    unique: true ,
    trim : true,
},
fullName: {
    type:String,
    index: true,
    required : true ,
    trim : true,
},
avatar: {
    type:String,
    required : true ,
},
coverImage: {
    type:String,
},
watchHistory:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Video"
}],
password: {
type:String,
required:[true,"Password is required"],
},
refreshToken:{
    type:String,

}
},
{
    timestamps:true
})
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect=async function(password){
return await bcrypt.compare(password,this.password)
}

export const User = mongoose.model("User", userSchema);