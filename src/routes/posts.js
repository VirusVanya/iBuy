const express = require('express');
const path = require('path');
const Item = require('../models/item');
const ItemImage = require('../models/item-image');

const router = express.Router();

const createPath = (page) => path.resolve(__dirname, '../../views', `${page}.ejs`);

router.get('/posts', (req,res) => {
    res.redirect('/');
});

router.get('/posts/:id', (req,res) => {
    if(!req.isAuthenticated()) {
        res.redirect('/signup');
    } else {
        Item
            .findById(req.params.id)
            .then((item) => {
                ItemImage
                    .find({itemId: req.params.id})
                    .then((image) => {
                        res.render(createPath('post'), {title: item.name, item, image: image[0], user: req.user});
                    })
                    .catch((error) => {
                        console.log(error);
                        res.render(createPath('error'), {title: "Error", user: req.user});
                    });
            })
            .catch((error) => {
                console.log(error);
                res.render(createPath('error'), {title: "Error", user: req.user});
            })
    }
});

module.exports = router;