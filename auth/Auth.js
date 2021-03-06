const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const jwtSecret = 'cca5b1a591c7119ea33bbd24f8540f724601d0785150df29f43172cb1ab3892ef0f515'

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
        })).then(user => {
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign(
                {id : user._id,
                username,
                role: user.role},
                jwtSecret,
                {
                    expiresIn: maxAge
                }
            )
        }
            
        )
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000,
        })
        res.status(201).json({
            message: "User Successfully Created",
            error: error.message,
        })
    } catch (err) {
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
        const user = await User.findOne({username});
        if (!user) {
            res.status(401).json({
                message: "Login Unsuccessful",
                error: "User not found"
            });
        } else {
                bcrypt.compare(password, user.password).then(function (result) {
                    if (result) {
                        const maxAge = 3 * 60 * 60;
                        const token = jwt.sign(
                            { id: user._id, username, role: user.role },
                            jwtSecret,
                            {
                                expiresIn: maxAge, // 3hrs in sec
                            }
                        );
                        res.cookie("jwt", token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000, // 3hrs in ms
                        });
                            res.status(201).json({
                            message: "User successfully Logged in",
                            user: user._id,
                        });
                    } else {
                        res.status(400).json({message: "Login unsuccessful"})
                    }      
                });
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
    const { id } = req.body
    await User.findById(id)
      .then(user => user.remove())
      .then(user =>
        res.status(201).json({ message: "User Banished", user })
      )
      .catch(error =>
        res
          .status(400)
          .json({ message: "An error occurred", error: error.message })
      )
  }