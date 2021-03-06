const express = require('express');
const mysql = require('mysql');
const db = require('../../connection');
const Post = require('../../app');

const router = express.Router();

router.get('/blogPage', (req, res) => {
    res.render('blogHome');
});


router.get('/postForm', (req, res) => {
    res.render('post');
});

router.post('/createPost', (req, res) => {
    const { title, author, content } = req.body;
    // Checks if all the information is given
    if (title && author && content) {
        let sql = "INSERT INTO posts SET ?";
        db.query(sql, { title, author, content }, async (err, result) => {
            if (err) {
                console.log(err);
                let error_msg = 'Could not create post. Please try again';
                res.render('blogHome', { error_msg });
            } else {
                let success_msg = 'Post added';
                console.log(typeof Post.getAllPosts);
                let posts = await Post.getAllPosts();
                res.render('blogHome', { success_msg, posts });
            }
        });
    }
});

module.exports = router; 