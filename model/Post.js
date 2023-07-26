const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    imgUrl : {
        type : String,
        required : true
    },

    description : {
        type : String,
        required : true
    },

    likes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],

    comments : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Comment'
    }],

    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    cloudinary_id: {
        type: String
    }

    
} , {timestamps : true})

module.exports = mongoose.model('Post' , PostSchema)
