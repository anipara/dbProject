const mysql = require('mysql');
// This file holds the connection to the server

// Create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'peopledb'
})

// Connect
db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('mysql connected');
    }
});

module.exports = db;