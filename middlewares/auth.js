import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req?.cookies?.accessToken || req?.headers?.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
        error: true,
        success: false
      });
    }


    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    

    const user = await User.findById(decoded.id)
      .select('-password -refresh_token')
      .lean();

    if (!user) {
      return res.status(401).json({
        message: "User account not found",
        error: true,
        success: false
      });
    }


    req.userId = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token",
      error: true,
      success: false
    });
  }
};