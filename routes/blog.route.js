import { Router } from "express"; 
import upload from "../middlewares/multer.js";
import { createBlog, getAllBlogs, getBlogById } from "../controllers/blog.controller.js";
import { authenticate } from "../middlewares/auth.js";

const blogRouter = Router();


blogRouter.get("/", getAllBlogs);
blogRouter.get("/:id", getBlogById);
blogRouter.post("/create", authenticate, upload.single("image"), createBlog);


export default blogRouter;