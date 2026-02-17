import User from "../models/User"
import bcrypt from "bcrypt"
import { generateToken } from "../lib/utils"

// Sign up New User
export const signUp = async (req, res) => {
    const { fullName, email, password, bio } = req.body

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        })

        const token = generateToken(newUser._id)
        res.json({ success: true, userData: newUser, token, message: "Account created successfully" })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}


// Controller for login a user

export const login = async(req, res) => {
  try{
    const { email, password } = req.body
    const userData = await User.findOne({email})
  
    const isPasswordCorrect = await bcrypt.compare(password, userData.password)

    if(!isPasswordCorrect){
        return res.status(400).json({message: "Invalid password"})
    }

    const token = generateToken(userData._id)
    res.json({success: true, userData, token, message: "Login successful"})
    
  }catch(error){
    console.log(error.message)
    res.json({success: false, message: error.message})
  }
}

// Controller to check if user is authenticated

export const checkAuth = async(req, res) => {
    res.json({success: true, user: req.user})
}

















