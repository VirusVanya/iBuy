const express = require('express');
const path = require('path');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

const createPath = (page) => path.resolve(__dirname, '../../views', `${page}.ejs`);

router.get('/signup', (req,res) => {
    const title = "Sign Up";
    if(!req.isAuthenticated()) {
        res.render(createPath('registration'), {title, user: req.user});
    } else {
        res.redirect('/profile');
    }
});

router.post('/signup', async (req,res) => {
    const {name,email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    User
        .find({email: email, password: hashedPassword})
        .then((userCheck) => {
            if(userCheck.length == 0) {
                const user = new User({name: name, email: email, password: hashedPassword});
                user
                    .save()
                    .then((result) => res.redirect('/login'))
                    .catch((error) => {
                        console.log(error);
                        res.render(createPath('error'), {title: "Error", user: req.user});
                    });
            } else {
                res.send('This email is already used!');
            }
        })
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), {title: "Error", user: req.user});
        });
});

router.get('/login', (req,res) => {
    const title = "Log In";
    if(!req.isAuthenticated()) {
        res.render(createPath('login'), {title, user: req.user});
    } else {
        res.redirect('/profile');
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/signout', (req,res) => {
    req.logOut((error) => {
        if(error) {
            console.log(error);
            res.render(createPath('error'), {title: "Error", user: req.user});
        }
    });
    res.redirect('/');
});

module.exports = router;