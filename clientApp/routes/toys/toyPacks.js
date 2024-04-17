import express from "express";
import {getCategory, getCategoryList} from "../../controllers/toy/toyPacks.js";

export default () => {
    const router = express.Router();

    router.get("/categories", getCategoryList);
    router.get("/category/:code", getCategory);

    // router.post("/pack", createPack);

    return router;
}