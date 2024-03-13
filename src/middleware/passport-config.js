const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        User
            .findOne({email: email})
            .then((user) => {
                if(user == null) {
                    return done(null, false, {message: 'There is no such user!'})
                } else {
                    bcrypt.compare(password, user.password)
                        .then((result) => {
                            if(result) {
                                return done(null, user);
                            } else {
                                return done(null, false, {message: 'Wrong password!'})
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            return done(error);
                        });
                }
            })
            .catch((error) => {
                console.log(error);
                return done(error);
            });
    }
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then((user) => {
                done(null, user)
            })
            .catch((error) => {
                console.log(error);
                done(error);
            });
    });
}

module.exports = initialize;