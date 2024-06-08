import express from "express";
import parentAuth from "../middlewares/parentAuth.js";
import {createAnnouncement, getMyAnnouncements, updateAnnouncement} from "../controllers/announcement/seller.js";
import {getCategories, getList, getListByIds, getSingle} from "../controllers/announcement/bayer.js";

export default () => {
    const router = express.Router();

    router.get("/list", getList);
    router.post("/list", parentAuth, getListByIds);
    router.get("/single/:id", getSingle);
    router.get("/categories", getCategories);
    router.get("/my", parentAuth, getMyAnnouncements);
    router.post("/create", parentAuth, createAnnouncement);
    router.put("/update/:id", parentAuth, updateAnnouncement);

    return router;
}