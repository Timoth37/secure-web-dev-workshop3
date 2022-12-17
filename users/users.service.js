const User = require('./users.model')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config()

//Register username and hashed password of the new user in the database.
async function registerUser(data){
    try{
        const salt = await bcrypt.genSalt()
        const user = new User({username : data.username, password : await bcrypt.hash(data.password, salt), role : "user"})
        await user.save()
        return user
    }catch(e){
        throw new Error("Wrong data")
    }
}

//Return a JWT token by providing the username and id of the user.
function signJWT(user){
    const token = jwt.sign(
        { _id: user._id, username : user.username },
        process.env.SECRET_KEY,
        {
            expiresIn: "2h",
        }
    );
    user.token = token;
    return user;
}

//Return all the users of the database.
async function findAllUser(){
        const users = await User.find()
        return users
}

//Return one user searched by a particular attribute (username or ID).
async function findUser(value){
    const user = await User.findOne(value)
    if(!user)
        throw new Error("User not found")
    return user;
}

//Update a user (username and password), hashing the new password.
async function updateUser(id, update){
    const salt = await bcrypt.genSalt()
    const user = await User.updateOne({ _id: id }, {
        username : update.username,
        password : await bcrypt.hash(update.password, salt)
    })
    if(!user)
        throw new Error("User not found")
    return user
}

//Delete a user with the ID gave in parameter.
async function deleteUser(id){
    const user = await User.findOneAndDelete( {_id : id})
    if(!user)
        throw new Error("User not found")
    return user
}


module.exports.signJWT = signJWT;
module.exports.registerUser = registerUser;
module.exports.findAllUser = findAllUser;
module.exports.findUser = findUser;
module.exports.deleteUser = deleteUser;
module.exports.updateUser = updateUser;

