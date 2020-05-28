const express = require('express');
const exphbs = require('express-handlebars');
const db = require('./connection');
const people = require('./routes/api/people');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStorage = require('passport-local').Strategy;
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('flash');
const cookieParser = require('cookie-parser');

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
const app = express();

// Handlebars middleware
// this sets the view engine to handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body Parser middleware 
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

// // Express Session
// app.use(session({
//     secret: 'secret',
//     saveUninitialized: true,
//     resave: true
// }));

// Passport init
// app.use(passport.initialize());
// app.use(passport.session());

// // Express Validator
// app.use(expressValidator({
//     errorFormatter: (param, msg, value) => {
//         var namespace = param.split('.'),
//             root = namespace.shift(),
//             formParam = root;
//         while (namespace.length) {
//             formParam += '[' + namespace.shift() + ']';
//         }
//         return {
//             param: formParam,
//             msg,
//             value
//         };
//     }
// }));

// // Connect flash
// app.use(flash());

// // Global Variables
// app.use((req, res) => {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.error = req.flash('error');
// });

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------

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


// create table
app.get('/createpeopletable', (req, res) => {
    let sql = `CREATE TABLE people (id int AUTO_INCREMENT, name VARCHAR(255), job VARCHAR(255), email VARCHAR(255), PRIMARY KEY (id))`;;
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
app.post('/cleartable', (req, res) => {
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


// people api route
app.use("/api/people", people);


// route for home page
app.get('/home', (req, res) => {
    res.render('home');
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.get('/', (req, res) => {
    res.render('login');
})



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server listening on port 3000"));
module.exports = app;   