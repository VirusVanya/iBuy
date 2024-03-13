const express = require('express');
const path = require('path');

const router = express.Router();

const createPath = (page) => path.resolve(__dirname, '../../views', `${page}.ejs`);

router.get('/about', (req,res) => {
    const title = "About";
    res.render(createPath('about'), {title, user: req.user});
});

module.exports = router;