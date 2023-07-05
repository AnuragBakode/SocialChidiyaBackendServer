const mongoose = require('mongoose')

const registrationOTPSchema = mongoose.Schema({
    email : {
        type : String,
        required : true
    }, 

    otp : {
        type : String,
        required : true
    }
}) 

module.exports = mongoose.model("RegistrationOTP" , registrationOTPSchema)