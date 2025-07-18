const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/authtestapp")

const UserSchema = mongoose.Schema({
    username:String,
    email: String,
    password: String,
    age:Number
})

module.exports = mongoose.model('user',UserSchema)