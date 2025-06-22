import { Router } from "express"; 
import upload from "../middlewares/multer.js";
import { createProject, deleteProject, getAllProjects, getProjectById, updateProject } from "../controllers/project.controller.js";
import { authenticate } from "../middlewares/auth.js";

const projectRouter = Router();


projectRouter.get("/", getAllProjects);
projectRouter.get("/:id", getProjectById);
projectRouter.post(
  "/create",
  authenticate,
  upload.any(),
  createProject
);

projectRouter.put(
  "/:id",
  authenticate,
  upload.any(),
  updateProject
);
projectRouter.delete("/:id", authenticate, deleteProject);


export default projectRouter;