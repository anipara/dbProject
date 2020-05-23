const express = require('express');
const mysql = require('mysql');
const app = require('../../app');
const uuid = require('uuid');
const db = require('../../connection');

// used to route calls specific to people
const router = express.Router();


// add people
router.post('/addPerson', (req, res) => {

    console.log(req.originalUrl)
    let person = {
        name: req.params.name,
        email: req.params.email,
        job: req.params.job
    };
    let sql = 'INSERT INTO people SET ?';
    console.log("THE query is: " + sql);
    // the question mark is a place holder for the second args in db.query
    let query = db.query(sql, person, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send('Person added');
        }
    });
})


module.exports = router; 
