import express from "express";
import {phoneSmsAuth, sendSms, tokenAuth} from "../controllers/parent/auth.js";
import parentAuth from "../middlewares/parentAuth.js";
import {
    addChildren,
    getChildren,
    updateChildren,
    updateInfo,
    deleteChildren,
    setFavorite, setCart
} from "../controllers/parent/data.js";
import {
    callRequest,
    registerActiveTrialList,
    registerGetTrial,
    registerTrial
} from "../controllers/parent/trialRegistration.js";
import {parentRequest} from "../controllers/request.js";
import {getSubscribe} from "../controllers/toy/toySubscribe.js";

export default () => {
    const router = express.Router();

    router.post("/sendSms", sendSms);
    router.post("/smsAuth", phoneSmsAuth);
    router.get("/tokenAuth", parentAuth, tokenAuth);


    router.put("/data/update", parentAuth, updateInfo);
    router.get("/data/children/get", parentAuth, getChildren);
    router.post("/data/children/add", parentAuth, addChildren);
    router.put("/data/children/update", parentAuth, updateChildren);
    router.delete("/data/children/delete/:id", parentAuth, deleteChildren);

    router.post("/register/trial", parentAuth, registerTrial)
    router.get("/register/trial/activelist", parentAuth, registerActiveTrialList)
    router.get("/register/trial/:trialId", parentAuth, registerGetTrial)
    router.get("/callRequest/:institution_id", parentAuth, callRequest)

    router.post("/request", parentAuth, parentRequest)

    router.get("/toySubscribe", parentAuth, getSubscribe)

    router.put("/setFavorite", parentAuth, setFavorite)
    router.put("/setCart", parentAuth, setCart)

    return router;
}