const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../connection');
const mysql = require('mysql');


// This local strategy gets used in people.js in the login post route.
module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Matches User
            let sql = `SELECT * FROM people
               WHERE email = '${email}'`;
            console.log(sql);
            let query = db.query(sql, (err, result) => {
                if (err) {
                    return done(null, false, { message: `Error thrown in local strategy ` });
                } else {
                    // Checks if there is a matching email 
                    console.log(result);
                    if (!(result === undefined || result.length == 0)) {
                        // Match Password
                        console.log('HERE ' + password.toString() + ' ' + result[0].password);
                        bcrypt.compare(password.toString(), result[0].password, (err, isMatch) => {
                            if (err) {
                                throw (err);
                            } else if (isMatch) {
                                return done(null, result[0]);
                            } else {
                                return done(null, false, { message: 'Password incorrect' });
                            }
                        });
                    } else {
                        // No email matches in db
                        return done(null, false, { message: `Email doesn't exist ` });
                    }
                }
            })
        })
    );
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {

        db.query(`SELECT * FROM people  
                WHERE id = ${id}`, (err, rows) => {
            done(err, rows[0]);
        });
    });
} 