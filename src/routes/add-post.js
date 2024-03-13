const express = require('express');
const path = require('path');
const Item = require('../models/item');
const ItemImage = require('../models/item-image');
const fs = require('fs');
const upload = require('../middleware/storage-config');

const router = express.Router();

const createPath = (page) => path.resolve(__dirname, '../../views', `${page}.ejs`);

router.post('/add-post', upload.single('image'), (req,res) => {
    const {name,description,price,location} = req.body;
    const userName = req.user.name;
    const userEmail = req.user.email;
    const item = new Item({name,description,price,location,userName,userEmail});
    item
        .save()
        .then((result) => {
            const itemId = result._id;
            const itemImage = new ItemImage({itemId: itemId, userEmail: userEmail, img: {data: fs.readFileSync(path.resolve(__dirname, '../uploads', req.file.filename)), contentType: 'image/png'}});
            itemImage
                .save()
                .then((resultimg) => res.redirect('/'))
                .catch((error) => {
                    console.log(error);
                    res.render(createPath('error'), {title: "Error", user: req.user});
                });
        })
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), {title: "Error", user: req.user});
        });
});

router.get('/add-post', (req,res) => {
    const title = "Add Post";
    if(!req.isAuthenticated()) {
        res.redirect('/signup');
    } else {
        res.render(createPath('add-post'), {title, user: req.user});
    }
});

module.exports = router;