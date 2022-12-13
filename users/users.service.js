const Users = require('./users.model')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config()

async function registerUser(data){
    try{
        const salt = await bcrypt.genSalt()
        const users = new Users({username : data.username, password : await bcrypt.hash(data.password, salt), role : "user"})
        console.log(users)
        await users.save()
        return users
    }catch(e){
        throw new Error("Wrong data")
    }
}

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

async function findAll(){
        const users = await Users.find().select({"password" : 0})
        return users
}


async function updateByID(id, update){
    const user = await Users.updateOne({ _id: id }, {
        username : update.username,
        password : update.password
    })
    if(!user)
        throw new Error("Not found")
    return user
}

async function deleteByID(id){
    console.log("ici")
    const user = await Users.findOneAndDelete( {_id : id})
    if(!user)
        throw new Error("Not found")
    return user
}


module.exports.signJWT = signJWT;
module.exports.registerUser = registerUser;
module.exports.findAll = findAll;
module.exports.deleteByID = deleteByID;
module.exports.updateByID = updateByID;

