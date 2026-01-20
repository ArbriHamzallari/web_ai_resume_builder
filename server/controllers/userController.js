import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Resume from "../models/Resume.js";
import { isAdminUser, getEffectivePlan } from "../utils/adminUtils.js";


const generateToken = (userId)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
    return token;
}

// controller for user registration
// POST: /api/users/register
export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        // check if required fields are present
        if(!name || !email || !password){
            return res.status(400).json({message: 'Missing required fields'})
        }

        // check if user already exists
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: 'User already exists'})
        }

         // create new user
         const hashedPassword = await bcrypt.hash(password, 10)
         const newUser = await User.create({
            name, email, password: hashedPassword
         })

         // return success message
         const token = generateToken(newUser._id)
         newUser.password = undefined;

         // Admin premium override: If user is admin, set isPremium to true
         const userObj = newUser.toObject()
         const effectivePlan = getEffectivePlan(newUser)
         if (isAdminUser(newUser.email)) {
            userObj.plan = effectivePlan
            userObj.isPremium = true // Admin users get premium access
            userObj.isAdmin = true // Flag for debugging/UI purposes
         } else {
            // Ensure isPremium reflects actual status
            userObj.isPremium = newUser.isPremium || false
         }

         // Set HTTP-only cookie for production security
         // secure: true for HTTPS (Render uses HTTPS)
         // sameSite: 'none' required for cross-origin requests
         res.cookie('token', token, {
             httpOnly: true,
             secure: true, // Always true on Render (HTTPS)
             sameSite: 'none', // Required for cross-origin requests
             maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
             path: '/'
         })

         return res.status(201).json({message: 'User created successfully', token, user: userObj})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for user login
// POST: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const { email, password} = req.body;

        // check if user exists
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        // check if password is correct
        if(!user.comparePassword(password)){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        // return success message
         const token = generateToken(user._id)
         user.password = undefined;

         // Admin premium override: If user is admin, set isPremium to true
         const userObj = user.toObject()
         const effectivePlan = getEffectivePlan(user)
         if (isAdminUser(user.email)) {
            userObj.plan = effectivePlan
            userObj.isPremium = true // Admin users get premium access
            userObj.isAdmin = true // Flag for debugging/UI purposes
         } else {
            // Ensure isPremium reflects actual status
            userObj.isPremium = user.isPremium || false
         }

         // Set HTTP-only cookie for production security
         // secure: true for HTTPS (Render uses HTTPS)
         // sameSite: 'none' required for cross-origin cookies
         res.cookie('token', token, {
             httpOnly: true,
             secure: true, // Always true on Render (HTTPS)
             sameSite: 'none', // Required for cross-origin requests
             maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
             path: '/'
         })

         return res.status(200).json({message: 'Login successful', token, user: userObj})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for getting user by id
// GET: /api/users/data
export const getUserById = async (req, res) => {
    try {
        
        const userId = req.userId;

        // check if user exists
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        
        // Admin premium override: If user is admin, set isPremium to true
        const effectivePlan = getEffectivePlan(user)
        const userObj = user.toObject()
        userObj.password = undefined
        
        // Override plan and premium status if admin (for frontend feature gating)
        if (isAdminUser(user.email)) {
            userObj.plan = effectivePlan
            userObj.isPremium = true // Admin users get premium access
            userObj.isAdmin = true // Flag for debugging/UI purposes
        } else {
            // Ensure isPremium reflects actual status
            userObj.isPremium = user.isPremium || false
        }
        
        return res.status(200).json({user: userObj})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for getting user resumes
// GET: /api/users/resumes
export const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId;

        // return user resumes
        const resumes = await Resume.find({userId})
        return res.status(200).json({resumes})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}