const express = require('express');
const mysql = require('mysql');
const db = require('../../connection');


// used to route calls specific to people
const router = express.Router();
// router.use(bodyParser.json());
// this handles for submissions 
// router.use(bodyParser.urlencoded({ extended: true }));

router.post('/addPerson', (req, res) => {
    console.log(req.headers);
    let person = {
        name: req.body.name,
        email: req.body.email,
        job: req.body.job
    };
    console.log('----------------');
    console.log(req.body);
    console.log('----------------');
    console.log(person);
    let sql = 'INSERT INTO people SET ?';
    console.log("THE query is: " + sql);
    // the question mark is a place holder for the second args in db.query
    let query = db.query(sql, person, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.redirect('/');
        }
    });
})


module.exports = router; 
