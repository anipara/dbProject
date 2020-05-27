const express = require('express');
const mysql = require('mysql');
const db = require('../../connection');


// used to route calls specific to people
const router = express.Router();
// router.use(bodyParser.json());
// this handles for submissions 
// router.use(bodyParser.urlencoded({ extended: true }));

router.post('/addPerson', async (req, res) => {
    let person = {
        name: req.body.name,
        email: req.body.email,
        job: req.body.job
    };
    // checks if person already in db or not
    let validPerson = await checkPerson(person);
    if (validPerson) {
        let sql = 'INSERT INTO people SET ?';
        // the question mark is a place holder for the second args in db.query
        let query = db.query(sql, person, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log('added person');
                res.redirect('/');
            }
        });
    } else {
        // redirects to error page when person entered is already in db
        res.redirect('/api/people/error');
    }
});

router.post('/deletePerson', (req, res) => {
    console.log('in delte');
    // checks if all args are passed
    if (req.body.name && req.body.email && req.body.job) {
        let sql = `DELETE FROM people
                WHERE name = '${req.body.name}' AND
                 email = '${req.body.email}' AND
                 job = '${req.body.job}' `;
        let query = db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/');
    }
});

router.get('/error', (req, res) => {
    res.render('error');
});

// Displays all poeple in db
router.post('/displayPeople', (req, res) => {
    const sql = `SELECT * FROM people`
    let query = db.query(sql, (err, result) => {
        if (err) { console.log(err); }
        else {
            console.log('rendering page');
            console.log(result);
            res.render('people', { result: result });
        }
    })
})

// This func has to be async bc we want to wait for the response from this func before
// moving on in my addPerson method
async function checkPerson(person) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM people
               WHERE name = '${person.name}' AND
                   email = '${person.email}' AND
                   job = '${person.job}'`;
        let query = db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                // checks if there is result set > 0 meaning the 
                // person already exists in db 
                if (result.length > 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }
        });
    });
}

module.exports = router; 
