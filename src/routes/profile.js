const express = require('express');
const path = require('path');
const Item = require('../models/item');
const ItemImage = require('../models/item-image');

const router = express.Router();

const createPath = (page) => path.resolve(__dirname, '../../views', `${page}.ejs`);

router.get('/profile', (req,res) => {
    const title = "Your Profile";
    if(!req.isAuthenticated()) {
        res.redirect('/signup');
    } else {
        res.render(createPath('profile'), {title, user: req.user});
    }
});

router.get('/myposts', (req,res) => {
    const title = "My Ads";
    if(!req.isAuthenticated()) {
        res.redirect('/signup');
    } else {
        Item
            .find({userEmail: req.user.email})
            .then((items) => {
                ItemImage
                    .find({userEmail: req.user.email})
                    .then((itemImages) => {
                        res.render(createPath('myposts'), {title, items, itemImages, user: req.user});
                    })
                    .catch((error) => {
                        console.log(error);
                        res.render(createPath('error'), {title: "Error", user: req.user});
                    })
            })
            .catch((error) => {
                console.log(error);
                res.render(createPath('error'), {title: "Error", user: req.user});
            });
    }
});

module.exports = router;