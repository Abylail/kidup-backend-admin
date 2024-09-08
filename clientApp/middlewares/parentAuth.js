import {createError} from "../../helpers/responser.js";
import {decodeToken} from "../../helpers/generateAccessToken.js";

export default (req, res, next) => {
    const token = req.cookies.userToken || req.header('Authorization').replace('Bearer ', '');

    if (!token) return res.status(401).json(createError("Пользователь не авторизован"))

    const decoded = decodeToken(token);
    if (!decoded) return res.status(401).json(createError("Пользователь не авторизован"))
    req.parentId = decoded.id;
    return next();
}