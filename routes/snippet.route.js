import { Router } from "express"; 
import { authenticate } from "../middlewares/auth.js";
import { CreateSnippetController, deleteSnippetController, getAllSnippet, updateSnippetController } from "../controllers/snippet.controller.js";


const snippetRouter = Router(); 

snippetRouter.post("/", authenticate, CreateSnippetController ); 
snippetRouter.get("/", authenticate, getAllSnippet );
snippetRouter.put("/:id", authenticate, updateSnippetController); 
snippetRouter.delete("/:id", deleteSnippetController);


export default snippetRouter;
