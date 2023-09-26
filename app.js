const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const dotenv = require('dotenv');
const session = require('express-session');
const User = require('./models/user');
const Item = require('./models/item');
const ItemImage = require('./models/item-image');

const app = express();

dotenv.config();

mongoose
    .connect(process.env.DB)
    .then((res) => console.log('Connected to db'))
    .catch((error) => console.log(error));

const createPath = (page) => path.resolve(__dirname, 'pages', `${page}.ejs`);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

const upload= multer({storage: storage});

app.listen(process.env.PORT, () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.get('/', (req,res) => {
    const title = "Home";
    let signedIn;
    if(!req.cookies.userName || !req.cookies.userEmail) {
        signedIn = false;
    } else {
        signedIn = true;
    }
    Item
        .find()
        .then((items) => {
            ItemImage
                .find()
                .then((itemImages) => res.render(createPath('index'), {title, items, itemImages, signedIn}))
                .catch((error) => {
                    console.log(error);
                    res.render(createPath('error'), {title: "Error", signedIn});
                })
        })
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), {title: "Error", signedIn});
        })
});

app.get('/contact', (req,res) => {
    const title = "Contact";
    let signedIn;
    if(!req.cookies.userName || !req.cookies.userEmail) {
        signedIn = false;
    } else {
        signedIn = true;
    }
    res.render(createPath('contact'), {title, signedIn});
});

app.get('/about', (req,res) => {
    const title = "About";
    let signedIn;
    if(!req.cookies.userName || !req.cookies.userEmail) {
        signedIn = false;
    } else {
        signedIn = true;
    }
    res.render(createPath('about'), {title, signedIn});
});

app.post('/signup', (req,res) => {
    const {name,email,password} = req.body;
    User
        .find({email: email})
        .then((userCheck) => {
            if(userCheck.length == 0) {
                const user = new User({name,email,password});
                user
                    .save()
                    .then((result) => res.redirect('/login'))
                    .catch((error) => {
                        console.log(error);
                        res.render(createPath('error'), {title: "Error", signedIn: false});
                    });
            } else {
                res.send('This email is already used!');
            }
        })
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), {title: "Error", signedIn: false});
        });
});

app.get('/signup', (req,res) => {
    const title = "Sign Up";
    if(!req.cookies.userName || !req.cookies.userEmail) {
        res.render(createPath('registration'), {title, signedIn: false});
    } else {
        res.redirect('/profile');
    }
});

app.post('/login', (req,res) => {
    User
        .find({email: req.body.email, password: req.body.password})
        .then((user) => {
            if(user.length == 0) {
                res.send('Wrong password or email');
            } else {
                res.cookie('userName', user[0].name);
                res.cookie('userEmail', user[0].email);
                res.redirect('/profile');
            }
        })
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), {title: "Error", signedIn: false});
        });
});

app.get('/login', (req,res) => {
    const title = "Log In";
    if(!req.cookies.userName || !req.cookies.userEmail) {
        res.render(createPath('login'), {title, signedIn: false});
    } else {
        res.redirect('/profile');
    }
});

app.get('/signout', (req,res) => {
    res.clearCookie('userName');
    res.clearCookie('userEmail');
    res.redirect('/');
});

app.get('/profile', (req,res) => {
    const title = "Your Profile";
    if(!req.cookies.userName || !req.cookies.userEmail) {
        res.redirect('/signup');
    } else {
        res.render(createPath('profile'), {title, name: req.cookies.userName, email: req.cookies.userEmail, signedIn: true});
    }
});

app.get('/myposts', (req,res) => {
    const title = "My Ads";
    if(!req.cookies.userName || !req.cookies.userEmail) {
        res.redirect('/signup');
    } else {
        Item
            .find({userEmail: req.cookies.userEmail})
            .then((items) => {
                ItemImage
                    .find({userEmail: req.cookies.userEmail})
                    .then((itemImages) => {
                        res.render(createPath('myposts'), {title, items, itemImages, signedIn: true});
                    })
                    .catch((error) => {
                        console.log(error);
                        res.render(createPath('error'), {title: "Error", signedIn: true});
                    })
            })
            .catch((error) => {
                console.log(error);
                res.render(createPath('error'), {title: "Error", signedIn: true});
            });
    }
});

app.get('/posts', (req,res) => {
    res.redirect('/');
});

app.get('/posts/:id', (req,res) => {
    if(!req.cookies.userEmail || !req.cookies.userName) {
        res.redirect('/signup');
    } else {
        Item
            .findById(req.params.id)
            .then((item) => {
                ItemImage
                    .find({itemId: req.params.id})
                    .then((image) => {
                        res.render(createPath('post'), {title: item.name, item, image: image[0], signedIn: true});
                    })
                    .catch((error) => {
                        console.log(error);
                        res.render(createPath('error'), {title: "Error", signedIn: true});
                    });
            })
            .catch((error) => {
                console.log(error);
                res.render(createPath('error'), {title: "Error", signedIn: true});
            })
    }
});

app.post('/add-post', upload.single('image'), (req,res,next) => {
    const {name,description,price,location} = req.body;
    const userName = req.cookies.userName;
    const userEmail = req.cookies.userEmail;
    const item = new Item({name,description,price,location,userName,userEmail});
    item
        .save()
        .then((result) => {
            const itemId = result._id;
            const itemImage = new ItemImage({itemId: itemId, userEmail: userEmail, img: {data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), contentType: 'image/png'}});
            itemImage
                .save()
                .then((resultimg) => res.redirect('/'))
                .catch((error) => {
                    console.log(error);
                    res.render(createPath('error'), {title: "Error", signedIn: true});
                });
        })
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), {title: "Error", signedIn: true});
        });
});

app.get('/add-post', (req,res) => {
    const title = "Add Post";
    if(!req.cookies.userName || !req.cookies.userEmail) {
        res.redirect('/signup');
    } else {
        res.render(createPath('add-post'), {title, signedIn: true});
    }
});

app.use((req,res) => {
    const title = "Error";
    let signedIn;
    if(!req.cookies.userName || !req.cookies.userEmail) {
        signedIn = false;
    } else {
        signedIn = true;
    }
    res
        .status(404)
        .render(createPath('error'), {title, signedIn});
});