const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const db = require('./connection');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStorage = require('passport-local').Strategy;
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const { ensureAuthenticated } = require('./config/auth');
const path = require('path');

const people = require('./routes/api/people');
const posts = require('./routes/api/posts');

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
const app = express();

// Passport config
require('./config/passport')(passport);

app.use(express.static(path.join(__dirname, 'public')));

// Handlebars middleware
// this sets the view engine to handlebars 
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body Parser middleware 
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('keyboard cat'));

// Express Session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash 
app.use(flash());

// GLOBAL VARIABLES
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
// people api route
app.use("/api/people", people);
// posts api route
app.use("/api/posts", posts);


// create db
app.get('/createdb', (req, res) => {
    console.log('in create db');
    let sql = 'CREATE DATABASE peopledb';
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.redirect('/');
        }
    });
});

app.get('/deletedb', (req, res) => {
    console.log('in deletedb');
    let sql = 'DROP DATABASE IF EXISTS peopledb';
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.redirect('/');
        }
    });
})


// create people table
app.get('/createpeopletable', (req, res) => {
    let sql = `CREATE TABLE people (id int AUTO_INCREMENT, name VARCHAR(255),password VARCHAR(255), job VARCHAR(255), email VARCHAR(255), PRIMARY KEY (id))`;;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.redirect('/');
        }
    })
});


// clear table
app.get('/clearpeopletable', (req, res) => {
    console.log('in clear table');
    let sql = `DELETE FROM people`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render('emptyTable')
        }
    })
})


// create people table
app.get('/createpoststable', (req, res) => {
    let sql = `CREATE TABLE posts (id int AUTO_INCREMENT, title VARCHAR(255), author VARCHAR(255), content VARCHAR(8000), PRIMARY KEY (id))`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.redirect('/');
        }
    })
});

// route for home page
app.get('/blogPage', ensureAuthenticated, async (req, res) => {
    let posts = await getAllPosts();
    res.render('blogHome', { posts: posts });
})

app.get('/', (req, res) => {
    res.render('welcome');
})

async function getAllPosts() {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM posts';
        db.query(sql, (err, result) => {
            if (err) {
                console.log('Error in getAllPosts is:\n ' + err);
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
}




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server listening on port 3000"));
module.exports = app;