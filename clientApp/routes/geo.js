import express from "express";
import {getInstitutionSubjects, getList, getSubjects} from "../controllers/category.js";
import {getGeo} from "../controllers/geo.js";

export default () => {
    const router = express.Router();

    router.get("/", getGeo);

    return router;
}