const mongoose=require('mongoose')
const Schema=mongoose.Schema


const userSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    profileImage:{type:String,required:true},
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Role-based access
    createdAt: { type: Date, default: Date.now }
})

const UserModel=mongoose.model('users',userSchema)
module.exports=UserModel;