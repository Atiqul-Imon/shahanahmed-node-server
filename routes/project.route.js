import { Router } from "express"; 
import upload from "../middlewares/multer.js";
import { createProject, deleteProject, getAllProjects, getProjectById, updateProject } from "../controllers/project.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { dashboardLimiter } from "../middlewares/rateLimit.js";

const projectRouter = Router();


projectRouter.get("/", getAllProjects);
projectRouter.get("/:id", getProjectById);
projectRouter.post(
  "/create",
  authenticate,
  dashboardLimiter,
  upload.any(),
  createProject
);

projectRouter.put(
  "/:id",
  authenticate,
  dashboardLimiter,
  upload.any(),
  updateProject
);
projectRouter.delete("/:id", authenticate, dashboardLimiter, deleteProject);


export default projectRouter;