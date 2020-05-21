const express = require('express');
const exphbs = require('express-handlebars');
const PORT = 5000;

const app = express();


// Handlebars middleware
// this sets the view engine to handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// route for home page
app.get('/', (req, res) => {
    res.send('HEllo');
})


app.listen(PORT, () => console.log("Server listening on port 5000"));