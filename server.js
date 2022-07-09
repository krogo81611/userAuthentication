const express = require('express');
const app = express();
const PORT = 5500;
const connectDB = require('./db'); //Require db.js file. Inherently exprects a .js file.

connectDB(); //Using db.js file

app.use(express.json()); //Have application use express

app.use('/api/Auth', require('./Auth/Route')); //Custom middleware import

const server = app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`));

process.on('unhandledRejection', err => {
    console.error(`An error occured: ${err.message}`);
    server.close(() => process.exit(1));
}); //This code block is an error handler

