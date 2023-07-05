const mongoose = require('mongoose')
const {UserSchema} = require('./User')

const CommentSchema = mongoose.Schema({
    description : {
        type : String,
        required : true
    },

    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
})

module.exports = mongoose.model("Comment" , CommentSchema)
