const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true
    },
    token : String
})

const Users = mongoose.model('Users', usersSchema)
module.exports = Users