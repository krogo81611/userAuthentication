const express = require('express');
const app = express();
const PORT = 5500;
const connectDB = require('./db'); //Require db.js file. Inherently exprects a .js file.
const cookieParser = require('cookie-parser');
const {adminAuth, userAuth} = require('./middleware/auth')

connectDB(); //Using db.js file

app.use(express.json()); //Have application use express
app.use(cookieParser());
app.use('/api/Auth', require('./Auth/Route')); //Custom middleware import

app.get('/', (req,res) => res.render('home'));
app.get('/register', (req,res) => res.render('register'));
app.get('/login', (req,res) => res.render('login'));
app.get('/admin', adminAuth, (req, res) => res.render("admin"));
app.get('/basic', userAuth, (req,res) => res.send("user"));

const server = app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`));

process.on('unhandledRejection', err => {
    console.error(`An error occured: ${err.message}`);
    server.close(() => process.exit(1));
}); //This code block is an error handler

    