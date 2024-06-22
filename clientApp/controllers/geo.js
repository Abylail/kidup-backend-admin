import http from "http";
import {createError} from "../../helpers/responser.js";

export const getGeo = async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const reqOptions = {
        host: "ip-api.com",
        method: "GET",
        post: 80,
        path: encodeURI(`/json/${ip}`),
    }

    const request = http.request(reqOptions, r => {
        r.setEncoding("utf8");
        r.on("data", (r) => res.status(200).json(r))
    });

    request.on("error", (e) => res.status(500).json(createError("Город не определяется")));

    request.end();
}