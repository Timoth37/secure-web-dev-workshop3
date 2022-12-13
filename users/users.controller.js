const usersService = require("../users/users.service");
const router = require('express').Router()
const User = require("./users.model")
const passport = require("passport")
require('../auth/strategies')
const jwt = require('jsonwebtoken');
const authorizationMiddleware = require('../authorization/authorization.middleware')
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

router.get('/users/me', passport.authenticate('jwt',{session : false}), (req, res) => {
    return res.status(200).send({id : req.user._id,username :req.user.username})
})

router.put('/users/me', passport.authenticate('jwt', {session : false}), async (req, res) => {
    if(req.body.role!=null){
        return res.status(403).send("Forbidden")
    }
    try{
        const user = await usersService.updateByID(req.user._id, req.body)
        return res.status(200).send(user)
    }catch(e){
        if(e.message==="Not found"){
            return res.status(404).send(e.toString())
        }
        return res.status(400).send("Bad request")
    }
})

router.delete('/users/me', passport.authenticate('jwt', {session : false}), async (req, res) => {
    try{
        const user = await usersService.deleteByID(req.user._id)
        return res.status(200).send(user)
    }catch(e){
        if(e.message==="Not found"){
            return res.status(404).send(e.toString())
        }
        return res.status(400).send("Bad request")
    }
})

router.get('/users', passport.authenticate('jwt', {session :false}), async (req, res) => {
    authorizationMiddleware.canAccess(['admin'])
    try{
        const users = await usersService.findAll()
        return res.status(200).send(users)
    }catch(e){
        return res.status(400).send("Bad request")
    }
})

module.exports = router
