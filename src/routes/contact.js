const express = require('express');
const path = require('path');

let router = express.Router();

const createPath = (page) => path.resolve(__dirname, '../../views', `${page}.ejs`);

router.get('/contact', (req,res) => {
    const title = "Contact";
    res.render(createPath('contact'), {title, user: req.user});
});

module.exports = router;