const usersService = require("../users/users.service");
const router = require('express').Router()
const passport = require("passport")
require('../auth/strategies')
const authorizationMiddleware = require('../authorization/authorization.middleware')
require('dotenv').config()


//Login function, the user provides username and password, if the authentication is valid, it will provide a token.
router.post('/users/login', passport.authenticate('local', { session: false}),
async (req, res) =>{
    const user = await usersService.signJWT(req.user);
    res.status(200).send({token : user.token});
});

//Register function, user provides username and password. He has the "user" role by default.
router.post('/users/register', async (req, res) => {
    if(req.body.role!=null){
        return res.status(403).send("Forbidden, you can't choose you role")
    }
    try{
        await usersService.registerUser(req.body)
        return res.status(200).send(req.body.username +" well registered !")
    }catch(e){
        return res.status(400).send("Bad request")
    }
})

//Get the information about the user authenticated by a valid token that we provided during the request : ID and Username.
router.get('/users/me', passport.authenticate('jwt',{session : false}), (req, res) => {
    return res.status(200).send({id : req.user._id,username :req.user.username})
})

//Modify username and password of the user authenticated by a valid token that we provided during the request.
router.put('/users/me', passport.authenticate('jwt', {session : false}), async (req, res) => {
    if(req.body.role!=null){
        return res.status(403).send("Forbidden")
    }
    try{
        await usersService.updateUser(req.user._id, req.body)
        return res.status(200).send("User has been updated")
    }catch(e){
        if(e.message==="User not found"){
            return res.status(404).send(e.toString())
        }
        return res.status(400).send("Bad request")
    }
})

//Delete the user authenticated by a valid token that we provided during the request.
router.delete('/users/me', passport.authenticate('jwt', {session : false}), async (req, res) => {
    try{
        const user = await usersService.deleteUser(req.user._id)
        return res.status(200).send(user.username +" deleted")
    }catch(e){
        if(e.message==="User not found"){
            return res.status(404).send(e.toString())
        }
        return res.status(400).send("Bad request")
    }
})

//Display the ID and Username of all users. The user authenticated by the token must be an admin.
router.get('/users',
    passport.authenticate('jwt', {session :false}),
    authorizationMiddleware.canAccess(['admin']),
    async (req, res) => {
    try{
        const users = await usersService.findAllUser()
        return res.status(200).send(users)
    }catch(e){
        return res.status(400).send("Bad request")
    }
})

module.exports = router
