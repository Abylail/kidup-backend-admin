import express from "express";
import onlyAdmin from "../../middlewares/onlyAdmin.js";
import {
    createCategoryPack, createPack,
    deleteCategoryPack, deletePack,
    getCategoryList,
    updateCategoryPack, updatePack
} from "../../controllers/toys/toyPacks.js";

export default () => {
    const router = express.Router();

    router.get("/categories", getCategoryList);

    router.post("/categories", onlyAdmin, createCategoryPack);
    router.put("/categories/:id", onlyAdmin, updateCategoryPack);
    router.delete("/categories/:id", onlyAdmin, deleteCategoryPack);

    router.post("/pack", onlyAdmin, createPack);
    router.put("/pack/:id", onlyAdmin, updatePack);
    router.delete("/pack/:id", onlyAdmin, deletePack);

    return router;
}