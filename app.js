const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const passport= require('passport');
const initializePassport = require('./src/middleware/passport-config');

const indexRoute = require('./src/routes/index');
const contactRoute = require('./src/routes/contact');
const aboutRoute = require('./src/routes/about');
const authRoute = require('./src/routes/auth');
const addpostRoute = require('./src/routes/add-post');
const postsRoute = require('./src/routes/posts');
const profileRoute = require('./src/routes/profile');

const app = express();

dotenv.config();

mongoose
    .connect(process.env.DB_URL)
    .then((res) => console.log('Connected to db'))
    .catch((error) => console.log(error));

const createPath = (page) => path.resolve(__dirname, 'pages', `${page}.ejs`);

app.listen(process.env.PORT, () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(cookieParser('ikU187DPdwG7dK243G0U'));
app.use(flash());

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

app.use(session({
   secret: 'ikU187DPdwG7dK243G0U',
   saveUninitialized: false,
   resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

initializePassport(passport);

app.use('/', indexRoute);
app.use('/', contactRoute);
app.use('/', aboutRoute);
app.use('/', authRoute);
app.use('/', addpostRoute);
app.use('/', postsRoute);
app.use('/', profileRoute);

app.use((req,res) => {
    const title = "Error";
    res
        .status(404)
        .render(createPath('error'), {title, user: req.user});
});