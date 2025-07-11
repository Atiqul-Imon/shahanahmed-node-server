import { Router } from "express"; 
import { authenticate } from "../middlewares/auth.js";
import { CreateSnippetController, deleteSnippetController, getAllSnippet, updateSnippetController } from "../controllers/snippet.controller.js";
import { dashboardLimiter } from "../middlewares/rateLimit.js";


const snippetRouter = Router(); 

snippetRouter.post("/", authenticate, dashboardLimiter, CreateSnippetController ); 
snippetRouter.get("/", authenticate, getAllSnippet );
snippetRouter.put("/:id", authenticate, dashboardLimiter, updateSnippetController); 
snippetRouter.delete("/:id", authenticate, dashboardLimiter, deleteSnippetController);


export default snippetRouter;
