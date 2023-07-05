const mongoose = require('mongoose')
const {PostSchema} = require('./Post')

const UserSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        max : 255
    },

    email : {
        type : String,
        required : true,
        max : 255
    },

    password : {
        type : String,
        required : true,
        min : 8,
        max : 255
    }, 

    date : {
        type : Date,
        default : Date.now
    },

    posts :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post'
    }],

    profilePicture : {
        type  : String,
    },

    bio : {
        type:String,
    },

    followings : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],

    followers :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
})

module.exports = mongoose.model("User" , UserSchema)
