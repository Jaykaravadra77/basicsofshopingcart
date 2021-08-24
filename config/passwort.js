const passport = require('passport');
const User = require('../models/user');
const LocalStartegy = require('passport-local').Strategy;
const validPassword = require('../passportUtils/passportUtil').validPassword;
const validator = require('validator');
const { check, validationResult } = require('express-validator');
const customFields = { usernameField: "email", passwordField: "password", passReqToCallback: true }
const verifyCallback = (req, email, password, done) => {
    if (validator.isEmail(email) && validator.isLength(password,{min:4})) {
        User.findOne({ email: email }).then((user) => {

            if (user) {
                const valid = validPassword(password, user.hash, user.salt);
                if (valid) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Invalid Credentials" });
                }
            }
            if (!user) {
                return done(null, false, { message: "Invalid Credentials" });
            }


        }).catch((err) => {
            return done(err);
        })

    }else{
        return done(null,false,{message: "Invalid Email"});
    }


}

passport.use('local.signin', new LocalStartegy(customFields, verifyCallback));


passport.serializeUser((user, done) => {
    done(null, user.id);
})


passport.deserializeUser((id, done) => {
    User.findById(id, (err, User) => {
        done(err, User);
    });
});
