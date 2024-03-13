const express = require('express');
const path = require('path');
const Item = require('../models/item');
const ItemImage = require('../models/item-image');

let router = express.Router();

const createPath = (page) => path.resolve(__dirname, '../../views', `${page}.ejs`);

router.get('/', (req,res) => {
    const title = "Home";
    Item
        .find()
        .then((items) => {
            ItemImage
                .find()
                .then((itemImages) => res.render(createPath('index'), {title, items, itemImages, user: req.user}))
                .catch((error) => {
                    console.log(error);
                    res.render(createPath('error'), {title: "Error", user: req.user});
                })
        })
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), {title: "Error", user: req.user});
        })
});

module.exports = router;