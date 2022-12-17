const localStrategy = require('passport-local').Strategy;
const jwtStrategy = require('passport-jwt').Strategy;
const passport = require('passport');
const {compareSync} = require("bcrypt");
const usersService = require("../users/users.service")
const ExtractJWT = require('passport-jwt').ExtractJwt;
require('dotenv').config()

//Local strategy, return different code of error considering the problem during the authentication
passport.use(new localStrategy(
    async function (username, password, done) {
        try{
            const user = await usersService.findUser({username: username})
            if (!user) {
                const err = new Error("Not found")
                err.status = 404;
                return done(err);
            }
            if (!compareSync(password, user.password)) {
                const err = new Error("Not matching")
                err.status = 403;
                return done(err);
            }
            return done(null, user)
        }catch(err){
            if (err) return done(err)
        }
    }
))

//Local strategy, return an error if the token is not valid
passport.use(
    new jwtStrategy(
        {
            secretOrKey: process.env.SECRET_KEY,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            try{
                const user = await usersService.findUser({_id: token._id})
                if (!user) return done(null, false, {message: "Something went wrong"})
                return done(null, user)
            }catch(err){
                if (err) return done(err)
            }
        }
    )
);
