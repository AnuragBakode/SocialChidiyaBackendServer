const express = require("express");
const router = express.Router();
const User = require("../model/User");
const OTP = require("../model/RegistrationOTP")
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const nodemailer = require('nodemailer')

dotenv.config()

const generateOTP = () => {
  return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
}

router.post('/sendOTP', async (req, res) => {
  const { error } = registerValidation(req.body)

  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  // check if email exists or not

  const emailExists = await User.findOne({ email: req.body.email })

  // If User exists 
  if (emailExists) return res.status(400).send("User Already Exists")

  // If dosen't exists 
  // Then we need to send an otp

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }

  })

  const generatedOTP = generateOTP();

  const mailOptions = {
    from: process.env.EMAIL,
    to: req.body.email,
    subject: "OTP for SocialChidiya Registration",
    html: `<h1>${generatedOTP}</h1>`
  }

  const Otp = new OTP({
    email: req.body.email,
    otp: generatedOTP
  })

  try {

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        res.status(400).send(error)
      } else {
        let savedOtp = await OTP.findOne({ email: req.body.email });
        if (savedOtp) {
          savedOtp.otp = generatedOTP
          savedOtp.save()
        } else {
          let newSavedOtp = await Otp.save();
        }

        res.status(201).json({ status: 201, info })
      }
    })

  } catch (error) {
    res.status(401).json(error)
  }
})


router.post("/register", async (req, res) => {

  // Before Creating the user we need to check whether 
  // the otp is correct or not

  const dbOTP = await OTP.findOne({ email: req.body.email })

  if (dbOTP.otp === req.body.otp) {
    // Hash the password

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // create User 
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    try {
      const savedUser = await user.save();
      const removeOTPData = await OTP.findOneAndRemove({email : req.body.email})
      res.json(savedUser._id);
    } catch (error) {
      res.status(401).send(error);
    }
  }else{
    res.status(401).send("Incorrect OTP")
  }
})

router.post('/login', async (req, res) => {
  // Validate the user before creating the user
  const { error } = loginValidation(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  // Check if the email exists 
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send("Email doesnt exists")

  // Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Incorrect Password");

  // Create and assign token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET , {
    expiresIn: '7d',
  })
  res.status(200).send({ "token": token, "isLoggedIn": true , "profilePicture" : user.profilePicture})
  // res.status(200).send("Logged In succesfully")

})

module.exports = router;
