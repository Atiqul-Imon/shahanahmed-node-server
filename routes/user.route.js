import { Router } from "express"; 
import { loginUser, RegisterUser } from "../controllers/user.controller.js";
import { authLimiter } from "../middlewares/rateLimit.js";

const userRouter = Router(); 

userRouter.post("/register", authLimiter, RegisterUser);
userRouter.post("/login", authLimiter, loginUser); 

export default userRouter;