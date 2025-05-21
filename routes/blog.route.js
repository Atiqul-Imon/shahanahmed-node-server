import { Router } from "express"; 
import upload from "../middlewares/multer.js";
import { createBlog, deleteBlog, getAllBlogs, getBlogById, updateBlog } from "../controllers/blog.controller.js";
import { authenticate } from "../middlewares/auth.js";

const blogRouter = Router();


blogRouter.get("/", getAllBlogs);
blogRouter.get("/:id", getBlogById);
blogRouter.post("/create", authenticate, upload.single("image"), createBlog);

blogRouter.put("/:id", authenticate, upload.single("image"), updateBlog);
blogRouter.delete("/:id", authenticate, deleteBlog);


export default blogRouter;