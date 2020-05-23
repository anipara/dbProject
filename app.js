const express = require('express');
const exphbs = require('express-handlebars');
const db = require('./connection');
const bodyParser = require('body-parser');
// const db = require('./connection');
const PORT = process.env.PORT || 3000;
// ---------------------------------------

// This is the main app object
const app = express();

// Handlebars middleware
// this sets the view engine to handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body Parser middleware
// handles raw json
app.use(bodyParser.json());
// this handles for submissions
app.use(bodyParser.urlencoded({ extended: false }));

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
            res.send('DB created... ');
        }
    });
});


// create table
app.get('/createpeopletable', (req, res) => {
    let sql = `CREATE TABLE people (id int AUTO_INCREMENT, name VARCHAR(255), job VARCHAR(255), email VARCHAR(255), PRIMARY KEY (id))`;;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send('People table created');
        }
    })
});


// people api route
app.use("/api/people", require('./routes/api/people'));


// route for home page
app.get('/', (req, res) => {
    console.log('reached home page');
    res.render('home');
})

app.listen(PORT, () => console.log("Server listening on port 3000"));

module.exports = app;