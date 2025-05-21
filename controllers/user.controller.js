import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"; 
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";

export async function RegisterUser(req, res){
    try {
        const {name, email, password} = req.body;

       if (!name || !email || !password) {
            return res.status(400).json({
                message: "Hey, don't be lazy — name, email, and password are all required.",
                error: true,
                success: false,
            });
        }


       const existingUser = await User.findOne({ email: email});

      if (existingUser) {
            return res.status(409).json({
                message: "A user is already registered with this email.",
                error: true,
                success: false,
            });
        }

       const salt = await bcryptjs.genSalt(10); 
       const hashPassword = await bcryptjs.hash(password, salt); 

       const newUser = new User({
        name, 
        email,
        password: hashPassword
       })

         await newUser.save();


       return res.status(201).json({
            message: "User registered successfully.",
            error: false,
            success: true,
        });

    } catch (error) {
        console.log(("Error in registerUser:", error));
        return res.status(500).json({
            message: "Something went wrong.",
            error: true,
            success: false,
        })
        
        
    }
}


export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    // Check password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid password",
        success: false,
        error: true,
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    // Set cookies
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Success response
    return res.json({
      message: "Login successful",
      success: true,
      error: false,
      data: {
        accessToken,
        refreshToken,
        email: user.email,
        userId: user._id
        
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
}