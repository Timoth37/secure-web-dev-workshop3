const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const User = require("../users/users.model");
const {compareSync} = require("bcrypt");
require('dotenv').config()


passport.use(new LocalStrategy(
    function (username, password, done){
        User.findOne({username : username}, function (err,user){
            if(err) return done(err)
            if(!user) {
                const err = new Error("Not found")
                err.status = 404;
                return done(err);
            }
            if(!compareSync(password, user.password)) {
                const err = new Error("Not matching")
                err.status = 403;
                return done(err);
            }
            return done(null, user)
        })
    }
))

const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
    new jwtStrategy(
        {
            secretOrKey: process.env.SECRET_KEY,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            User.findOne({_id : token._id}, function (err,user){
            if(err) return done(err)
            if(!user) return done(null, false, {message : "Something went wrong"})
            return done(null, user)
        })
        }
    )
);