module.exports = {
    ensureAuthenticated: (req, res, next) => {
        // built-in method that checks if the user has been authenticated
        if (req.isAuthenticated()) {
            return next();
        }
        let error_msg = 'Please log in to view this resource';
        res.render('login', { error_msg })
    }
} 