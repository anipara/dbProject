const express = require('express');
const mysql = require('mysql');
const db = require('../../connection');

const router = express.Router();

router.get('/blogPage', (req, res) => {
    res.render('blogHome');
});

router.get('/createPost', (req, res) => {
    res.render('post');
});

module.exports = router; 