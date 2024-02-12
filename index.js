const { findUserInDB, UserModel } = require("./models");
const dotenv = require("dotenv")
var express = require("express")
var bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const ms = require('ms')
const app = express()
const PORT = 3000;
const saltRounds = 10;
const expiresIn = '15m'

app.use(express.json())
dotenv.config();
process.env.SECRET_KEY;


const generateAccessToken = (email) => {
  return jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn })

}

app.post("/user/registration", async (req, res) => {
  try {
    email = req.body.email;
    username = req.body.username;
    password = req.body.password;
    hashedPassword = await bcrypt.hash(password, saltRounds)

    const userObject = {
      "email": email,
      "password": hashedPassword,
      "username": username
    }
    if (email) {
      result = UserModel.create(userObject)
      res.status(201).json({ success: true, message: "user added successfully" })
    }
  }
  catch (err) {
    console.log(err)
    res.json({ success: false, message: "could not register the user", error: err })
  }
})


app.post('/user/login', async (req, res) => {

  email = req.body.email;
  password = req.body.password;
  emailInDb = await findUserInDB(email)
  console.log(emailInDb)

  if (email == emailInDb.email) {
    comparision = await bcrypt.compare(password, emailInDb.password)
    if (comparision) {
      accessToken = generateAccessToken(email)
      res.status(200).json({ message: "user logged in ", success: true, access_token: accessToken })
    }
    else {
      res.status(401).json({ message: "invalid password", success: false })
    }
  }
  else {
    res.status(400).json({ "message": "email not found" })
  }
})

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})



