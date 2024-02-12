var mongoose = require("mongoose")
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


const findUserInDB = async (email) => {
  try {
    const data = await UserModel.findOne({ email: email }, { email: 1, password: 1 })
    return data ? data : null
  }
  catch (error) {
    console.log(error)
    return null
  }
}

module.exports = { findUserInDB, UserModel, UserSchema };
