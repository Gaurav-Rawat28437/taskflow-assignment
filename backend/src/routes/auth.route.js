const express = require("express")
const router = express.Router()
require("dotenv").config()

const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { userModel } = require("../models/user.model")
const { isLoggedIn } = require("../middleware/isLoggedIn.middleware")


router.post("/sign-up", async (req, res) => {
    try {
        const { email, username, password } = req.body

        if (!email || !password || !username) {
            throw new Error("email , password and username not received form frontend...")
        }

        if (!validator.isEmail(email)) {
            throw new Error("please enter valid email...")
        }

        if (!validator.isStrongPassword(password)) {
            throw new Error("please enter strong password...")
        }

        if (username.length < 2 || username.length > 20) {
            throw new Error("please enter usernamelength btw 2 to 20...")
        }

        const foundVerifyUser = await userModel.findOne({
            $or: [
                { email },
                { username }
            ]
        })

        if (foundVerifyUser) {
            return res.status(409).json({
                msg: "user already exist"
            })
        }


        const hashedPassword = await bcrypt.hash(password, 10)

        const createUser = await userModel.create({ username, email, password: hashedPassword })


        res.status(201).json({
            success: true,
            msg: "user successfully create"
        })

    }
    catch (error) {
        res.status(400).json({
            msg: error.message,
            error: error
        })
    }

})


router.post("/login", async (req, res) => {
    try {

        const { email, password, username } = req.body

        if (!email && !username) {
            throw new Error("please enter username or email...")
        }
        if (!password) {
            throw new Error("please enter password...")
        }

        const foundUser = await userModel.findOne({
            $or: [
                { email },
                { username }
            ]
        })

        if (!foundUser) {
            throw new Error("user not found,please create an account first")
        }

        const correctPassword = await bcrypt.compare(password, foundUser.password)

        if (!correctPassword) {
            throw new Error("password is incorrect,please enter valid password...")
        }


        const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" }) //can add expireing data init by passing {expiresIn:"7d"} it will expire in 7days

        const isProduction = process.env.NODE_ENV === "production"

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.set("Cache-Control", "no-store")

        res.status(200).json({
            success: true,
            msg: "user login successfully",
            data: {
                _id: foundUser._id,
                username: foundUser.username,
                email: foundUser.email,
            }
        })
    }
    catch (error) {
        res.status(400).json({
            msg: error.message,
            error: error
        })
    }
})



router.post("/logout", (req, res) => {
  const isProduction = process.env.NODE_ENV === "production"

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax"
  })

  res.set("Cache-Control", "no-store")

  return res.status(200).json({
    success: true,
    msg: "user logout successfully"
  })
})



router.get("/get-user-data", async (req, res) => {

    try {
        const { token } = req.cookies

        if (!token) {
            throw new Error("Please login again")
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET)

        const foundUser = await userModel.findById(decode.id)

        if (!foundUser) throw new Error("User logout,please login again...")

        res.set("Cache-Control", "no-store")

        res.status(200).json({
            success: true,
            msg: "user login successfully",
            data: {
                _id: foundUser._id,
                username: foundUser.username,
                email: foundUser.email,
            }
        })

    }
    catch (error) {
        res.status(401).json({
            msg: error.message,
            error: error
        })
    }
})


module.exports = {
    authRouter: router
}