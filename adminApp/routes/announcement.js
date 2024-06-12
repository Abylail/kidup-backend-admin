import express from "express";
import {getList, updateAnnouncement} from "../controllers/announcement/announcement.js";
import onlyAdmin from "../middlewares/onlyAdmin.js";

export default () => {
    const router = express.Router();

    router.get("/get", getList);
    router.put("/update/:id", onlyAdmin, updateAnnouncement);

    return router;
}