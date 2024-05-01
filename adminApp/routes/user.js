import express from "express";

import {register, login, tokenAuth, update, sendConfirmSms, centerRegister} from "../controllers/user.js";
import auth from "../middlewares/auth.js";
import onlyAdmin from "../middlewares/onlyAdmin.js";

export default () => {
    const router = express.Router();

    router.get("/login/token", auth, tokenAuth)
    router.post("/login", login)
    router.post("/register", onlyAdmin, register)
    router.put("/update", auth, update)

    router.post("/sendConfirmSms", sendConfirmSms)
    router.post("/center/register", centerRegister)

    return router;
}