const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose')
const dotenv= require("dotenv")
const auth = require('./routes/auth')
const postRoutes = require('./routes/posts')
const profileRoutes = require('./routes/profile')
const navbarRoutes = require('./routes/navbarUsersData')

const PORT = process.env.PORT || 4000


// Initializing app
const app = express();

// Configuring .env variables
dotenv.config()

// Database Connection 
mongoose.connect(process.env.MONGO_DB_CONNECT , {useNewUrlParser : true})
.then(()=> console.log("Db connected"))
.catch((e)=>console.log(e))


// MiddleWares
app.use(cors());
app.use(express.json());
app.use('/uploads' , express.static('uploads'))
app.use(auth);
app.use(postRoutes)
app.use((profileRoutes))
app.use(navbarRoutes)


app.listen(PORT, (req, res) => {
  console.log("Server Started");
});
