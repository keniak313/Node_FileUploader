import asyncHandler from "express-async-handler";
import { CustomNotFoundError } from "../errors/CustomNotFoundError.js";

const content = "main";

export const renderIndex = asyncHandler(async (req, res) => {
    res.render("index",{content: content})
});