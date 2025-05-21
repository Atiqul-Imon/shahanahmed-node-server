import { Router } from "express"; 
import { loginUser, RegisterUser } from "../controllers/user.controller.js";

const userRouter = Router(); 

userRouter.post("/register", RegisterUser);
userRouter.post("/login", loginUser); 

export default userRouter;