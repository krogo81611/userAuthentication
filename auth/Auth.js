const User = require('../model/User');
const bcrypt = require('bcryptjs')

exports.register = async (req, res, next) => {
    const {username, password} = req.body;
    if (password.length < 6) {
        return res.status(400).json({message: "password less than 6 characters"})
    }
    try {
        bcrypt.hash(password,10).then(async(hash) =>
        await User.create({
            username,
            password: hash,
        }).then(user => 
            res.status(200).json({
                message: "User successfully created",
                user,
            })
        )
    )} catch (err) {
        res.status(401).json({
            message: "User creation failed",
            error: error.message,
        })
    }
}

exports.login = async(req, res, next) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({
            message: "Username or password is empty",
        })
    }
    try {
        const user = await User.findOne({username, password});
        if (!user) {
            res.status(401).json({
                message: "Login Unsuccessful",
            })
        } else {
            res.status(200).json({
                message: "Login Successful",
                user,
            })
        }
    }
    catch (err) {
        res.status(400).json({
            message: "An error happened",
            error: error.message,
        })
    } 
}

exports.update = async (req, res, next) => {
    const {role, id} = req.body;
    if(role && id) {
        if (role === "admin") {
            await User.findById(id)
                .then((user) => {
                    if (user.role !== "admin") {
                        user.role = role
                        user.save((err) => {
                            if(err) {
                                res
                                .status(400)
                                .json({
                                    message: "An error Occurred",
                                    error: err.message
                                })
                                process.exit(1)
                            }
                            res.status(201).json({message: "Update Successful", user})
                        })
                    } else {
                        res.status(400).json({message: "User is already an Admin"})
                    }
                }) 
                .catch((error) => {
                    res
                    .status(400)
                    .json({message: "An error happened", error: error.message})
                })
        } else {
            res.status(400).json({
                message: "User is not Admin"
            })
        }
    } else {
        res.status(400).json({
            message: "Role or ID is missing"
        })
    }
}

exports.deleteUser = async (req, res, next) => {
    const {id} = req.body;
    await User.findById(id)
    .then(user => user.remove())
    .then(user => 
        res.status(201).json({message: "User Banished", user})
    )
    .catch(error => 
        res
            .status(400)
            .json({message: "An error occured", error: error.message})
        )
}