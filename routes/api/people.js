const express = require('express');
const mysql = require('mysql');
const db = require('../../connection');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// used to route calls specific to people
const router = express.Router();

router.get('/error', (req, res) => {
    res.render('error');
});

router.post('/addPerson', async (req, res) => {
    let person = {
        name: req.body.name,
        email: req.body.email,
        job: req.body.job,
        password: req.body.password
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
                res.redirect('/');
            }
        });
    } else {
        // redirects to error page when person entered is already in db
        res.redirect('/api/people/error');
    }
});

router.post('/deletePerson', (req, res) => {
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
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/');
    }
});


// Displays all poeple in db
router.post('/displayPeople', (req, res) => {
    const sql = `SELECT * FROM people`
    let query = db.query(sql, (err, result) => {
        if (err) { console.log(err); }
        else {
            res.render('people', { result: result });
        }
    })
})

// -----------------------------------------------------------------------------------------------------
// Register routes
router.post('/register', async (req, res) => {
    const { name, email, job, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2 || !job) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password too short' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            job,
            password,
            password2
        });
    } else {
        // Validation passed
        // Now check if email passed in is already in use or not
        let emailFlag = await checkEmail(email);
        if (emailFlag) {
            errors.push({ msg: 'Email already in use' });
            res.render('register', {
                errors,
                name,
                email,
                job,
                password,
                password2
            });
        } else {
            // Valid user and can now insert into db
            // Hash Pasword
            bcrypt.genSalt((err, salt) => {
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) { console.log(err); }
                    else {
                        const passHash = hash;
                        let added = await addPerson(name, email, job, passHash);
                        if (added) {
                            // we can access the global var defined in app.js
                            let success_msg = 'Registration Successfull. Please log in';
                            res.render('login', { email, success_msg });
                        } else {
                            res.redirect('/register');
                        }
                    }
                })
            });
        }
    }
});

router.get('/registerView', (req, res) => {
    res.render('register');
});
// -----------------------------------------------------------------------------------------------------
// Login routes
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/blogPage',
        failureRedirect: '/api/people/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/login', (req, res) => {
    res.render('login');
});

// -----------------------------------------------------------------------------------------------------
// Logout routes

router.get('/logout', (req, res) => {
    req.logOut();
    let success_msg = 'You have logged out';
    res.render('login', { success_msg });
});




// --------------------------------------------------------------------------------
// Functions
async function addPerson(name, email, job, password) {
    return new Promise((resolve, reject) => {
        let person = { name, email, job, password };
        let sql = 'INSERT INTO people SET ?';
        // the question mark is a place holder for the second args in db.query
        let query = db.query(sql, person, (err, result) => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    })
}


// --------------------------------------------------------------------------------

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

// CHecks if email is in db
async function checkEmail(email) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM people
               WHERE email = '${email}'`;
        let query = db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                // checks if there is result set > 0 meaning the 
                // person already exists in db 
                if (result.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
}

module.exports = router; 