import { Router } from "express"; 
import upload from "../middlewares/multer.js";
import { uploadEditorImage } from "../controllers/image.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { uploadLimiter } from "../middlewares/rateLimit.js";

const imageRouter = Router();

imageRouter.post(
  "/upload",
  authenticate,
  uploadLimiter,
  upload.single("image"),  
  uploadEditorImage
);

export default imageRouter; 