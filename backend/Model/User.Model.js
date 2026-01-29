const mongoose = require("mongoose")

const Schema = mongoose.Schema

const UserSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type:String,
        enum:['user','admin_perpon'],
        default:"user"
    }
}, {timestamps:true})

module.exports = mongoose.model('user', UserSchema)