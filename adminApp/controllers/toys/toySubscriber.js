import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";

export const getList = async (req, res) => {
    const subscribers = await models.ToySubscriber.findAll({
        order: [
            ['endSubscription', 'ASC'],
            ['createdAt', 'DESC'],
        ],
    });
    res.status(200).json(createResponse(subscribers));
}

export const getOne = async (req, res) => {
    const {id} = req.params;
    const subscriber = await models.ToySubscriber.findByPk(id);
    res.status(200).json(createResponse(subscriber));
}

export const createSubscriber = async (req, res) => {
    const {name, phone, rate = "Не указан", ratePrice, sale, tokens, fromRef, startSubscription, endSubscription, activeToys = "[]", comment, status, active = true, address} = req.body;

    if (!name || !phone) return res.status(500).json(createError("Не хватает аргументов"));

    const clientExist = await models.ToySubscriber.findOne({where: {phone}});
    if (!!clientExist) return res.status(500).json(createError("Клиент с таким номерос уже есть"));

    try {
        await models.ToySubscriber.create({
            name, phone, rate, ratePrice, sale, tokens, fromRef, startSubscription, endSubscription, activeToys, comment, status, active, address
        })
    } catch (e) {
        return res.status(500).json(createError("Не могу создать"));
    }

    const newSubscriber = await models.ToySubscriber.findOne({where: {phone}});
    return res.status(200).json(createResponse(newSubscriber));
}

export const updateSubscriber = async (req, res) => {
    const {id} = req.params;
    const {name, phone, rate, ratePrice, sale, tokens, fromRef, startSubscription, endSubscription, activeToys, comment, status, active, address} = req.body;

    try {
        await models.ToySubscriber.update({
            name, phone, rate, ratePrice, sale, tokens, fromRef, startSubscription, endSubscription, activeToys, comment, status, active, address
        }, {where: {id}})
    } catch (e) {
        return res.status(500).json(createError("Не могу создать"));
    }

    const updatedSubscriber = await models.ToySubscriber.findByPk(id);
    return res.status(200).json(createResponse(updatedSubscriber));
}

export const deleteSubscriber = async (req, res) => {
    const {id} = req.params;
    await models.ToySubscriber.destroy({where: {id}})
    return res.status(200).json({status: "OK"});
}