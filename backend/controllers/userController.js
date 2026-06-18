import asyncHandler from "express-async-handler";
import User from "../models/Users.js";
import {OAuth2Client} from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
}
 
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please fill all the fields");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400);
        throw new Error("Please fill all the fields");
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            preferrerdRole: user.preferredRole,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
});

const googleLogin = asyncHandler(async (req, res) => {
    const { tokenId } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const {email_verified, name, email, sub: googleId } = ticket.getPayload(); 
    if(!email_verified){
        return res.status(400).json({ message: "Google login failed" });
    }
   
        let user = await User.findOne({email});
        if(user) {
            if(!user.googleId){
                user.googleId = googleId;
                await user.save();
            }
             
        } else {
            user = await User.create({
                name,
                email,
                googleId,
                password: null
            });
        }

            if(user){
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
          }
 
        
     });
    
     const getUserProfile = asyncHandler(async (req, res) => {
        if(req.user){
            res.status(200).json({
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                preferredRole: req.user.preferredRole
            });
        }

        else {
            res.status(404).json({ message: "User not found" });
        }
     });


     const updateUserProfile = asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.preferredRole = req.body.preferredRole || user.preferredRole;

            if(req.body.password) {
                user.password = req.body.password;
            }
            
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                preferredRole: updatedUser.preferredRole
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
     });
     export { registerUser, loginUser, googleLogin, getUserProfile, updateUserProfile };