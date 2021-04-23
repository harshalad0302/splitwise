const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const user = require('./db_models/users');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "harshala"
module.exports = (passport) =>{
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done)=>{
            console.log(jwt_payload);
            //Mongoose model to check whether the user exist or not
            user.findOne({UID:jwt_payload})
            
            .then((user) =>{
                if(user){
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch((error)=>{
                console.log(error);
            })
        })
    )
}


