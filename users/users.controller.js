const usersService = require("../users/users.service");
const router = require('express').Router()
const User = require("./users.model")
const passport = require("passport")
require('../auth/local.strategy')
const jwt = require('jsonwebtoken');
const authorizationMiddleware = require('../authorization/authorization.middleware')
const locationsService = require("../locations/locations.service");
require('dotenv').config()


router.post('/users/login', passport.authenticate('local', { session: false}),
async (req, res) =>{
    const user = await usersService.signJWT(req.user);
    res.status(200).send({token : user.token});
});

router.post('/users/register', async (req, res) => {
    if(req.body.role!=null){
        return res.status(403).send("Forbidden")
    }
    try{
        const user = await usersService.registerUser(req.body)
        return res.status(200).send(user)
    }catch(e){
        return res.status(400).send("Bad request")
    }
})

router.get('/users/me', (req, res) => {
    const userToken = req.headers.authorization;
    const token = userToken.split(' ');
    const decoded = jwt.verify(token[1], process.env.SECRET_KEY);
    return res.status(200).send({id : decoded._id,username :decoded.username})
})

router.put('/users/me', async (req, res) => {
    const userToken = req.headers.authorization;
    const token = userToken.split(' ');
    const decoded = jwt.verify(token[1], process.env.SECRET_KEY);
    if(req.body.role!=null){
        return res.status(403).send("Forbidden")
    }
    try{
        const user = await usersService.updateByID(decoded._id, req.body)
        return res.status(200).send(user)
    }catch(e){
        if(e.message==="Not found"){
            return res.status(404).send(e.toString())
        }
        return res.status(400).send("Bad request")
    }
})

router.delete('/users/me', async (req, res) => {
    const userToken = req.headers.authorization;
    const token = userToken.split(' ');
    const decoded = jwt.verify(token[1], process.env.SECRET_KEY);
    try{
        const user = await usersService.deleteByID(decoded._id)
        return res.status(200).send(user)
    }catch(e){
        if(e.message==="Not found"){
            return res.status(404).send(e.toString())
        }
        return res.status(400).send("Bad request")
    }
})

router.get('/users', async (req, res) => {
    try{
        const users = await usersService.findAll()
        return res.status(200).send(users)
    }catch(e){
        return res.status(400).send("Bad request")
    }
})

module.exports = router
