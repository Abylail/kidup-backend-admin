import express from "express";
import parentAuth from "../middlewares/parentAuth.js";
import {
    addPhotoAnnouncement,
    createAnnouncement, deleteAnnouncement,
    getDraftAnnouncement, getMyAnnouncement,
    getMyAnnouncements, publishDraft, removePhotoAnnouncement,
    updateAnnouncement
} from "../controllers/announcement/seller.js";
import {buy, getCategories, getList, getListByIds, getSingle, myPurchases} from "../controllers/announcement/bayer.js";

export default () => {
    const router = express.Router();

    router.get("/list", getList);
    router.post("/list", parentAuth, getListByIds);
    router.get("/get/:id", parentAuth, getMyAnnouncement);
    router.get("/single/:id", getSingle);
    router.get("/categories", getCategories);
    router.get("/my", parentAuth, getMyAnnouncements);
    router.get("/purchases", parentAuth, myPurchases);
    router.post("/create", parentAuth, createAnnouncement);
    router.get("/draft", parentAuth, getDraftAnnouncement);
    router.put("/update/:id", parentAuth, updateAnnouncement);
    router.put("/publish/:id", parentAuth, publishDraft);
    router.post("/update/:id/addphoto", parentAuth, addPhotoAnnouncement);
    router.post("/update/:id/removephoto", parentAuth, removePhotoAnnouncement);
    router.delete("/delete/:id", parentAuth, deleteAnnouncement);
    router.post("/buy", parentAuth, buy);

    return router;
}