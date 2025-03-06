import { Router } from "express";

export const indexRouter = Router();
import { renderIndex } from "../controllers/indexController.js";


indexRouter.get("/", (req,res)=>{
    renderIndex();
})