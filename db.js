const Mongoose = require('mongoose');
const RemoteDB = `mongodb+srv://rogotron:testPassword@cluster0.snxpl4f.mongodb.net/?retryWrites=true&w=majority`;
const connectDB = async () => {
    await Mongoose.connect(RemoteDB)
    .then(client => {
        console.log("Successfully Connected to Database");
    })
}

module.exports = connectDB;