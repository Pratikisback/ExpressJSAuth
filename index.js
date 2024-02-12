const { findUserInDB, UserSchema, UserModel } = require("./models");
var mongoose = require("mongoose")
var express = require("express")
var bcrypt = require("bcrypt");


const app = express()
const PORT = 3000;
const saltRounds = 10;
app.use(express.json())

mongoose.connect("mongodb://localhost:27017/UsersData").then(() => {
  console.log("Connection is successfull")

}).catch((error) => {
  console.log(error)
})

const UserSchema = {
  "email": String,
  "username": String,
  "password": String
}


const UserModel = mongoose.model("User", UserSchema)

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
  emailInDb = findUserInDB(email)

  if (email == emailInDb.email) {
    comparision = bcrypt.compare(password, emailInDb.password)
    if (comparision) {
      res.status(200).json({ message: "user logged in ", success: true })
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



