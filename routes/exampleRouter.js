import { Router } from "express";

export const exampleRouter = Router();

const content = "example"

exampleRouter.get("/", (req,res)=>{
    res.render("index",{content: content})
})