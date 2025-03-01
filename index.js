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
  mongoose
    .connect(process.env.MONGO_DB_CONNECT, { useNewUrlParser: true })
    .then(() => console.log("Db connected"))
    .catch((e) => console.log(e));

  // MiddleWares
  app.use(
    cors({
      origin: "https://social-chidiya.netlify.app",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      credentials: true,
    })
  );

  // For debugging CORS
  app.use((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "https://social-chidiya.netlify.app"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    next();
  });
app.use(express.json());
app.use('/uploads' , express.static('uploads'))
app.use(auth);
app.use(postRoutes)
app.use((profileRoutes))
app.use(navbarRoutes)


app.listen(PORT, (req, res) => {
  console.log("Server Started");
});
