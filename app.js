const express = require('express');
const exphbs = require('express-handlebars');
const db = require('./connection');
const people = require('./routes/api/people');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
// ---------------------------------------

// starts express application
const app = express();

// Handlebars middleware
// this sets the view engine to handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body Parser middleware
// handles raw json posts
// app.use(bodyParser.json());
// this handles for url encoded posts 
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => console.log("Server listening on port 3000"));
// ---------------------------------------


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


// people api route
app.use("/api/people", people);


// route for home page
app.get('/', (req, res) => {
    console.log('reached home page');
    res.render('home');
})

module.exports = app;   