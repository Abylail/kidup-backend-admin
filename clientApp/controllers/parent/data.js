import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";

export const updateInfo = async (req, res) => {
    const parentId = req.parentId;
    const {first_name, last_name, phone} = req.body;

    try {
        await models.Parent.update({first_name, last_name}, {where: {id: parentId}})
    } catch (e) {
        res.status(500).json(createError("Не могу обновить пользователя"));
    }

    const newParent = await models.Parent.findOne({where: {id: parentId}})

    return res.status(200).json(createResponse(newParent))
}

export const getChildren = async (req, res) => {
    const parentId = req.parentId;
    const children = await models.Child.findAll({where: {parent_id: parentId}});
    return res.status(200).json(createResponse(children));
}

export const addChildren = async (req, res) => {
    const parentId = req.parentId;
    const {name, age, gender} = req.body;
    const parent = await models.Parent.findByPk(parentId);

    if (!parent) return res.status(500).json(createError("Нет родителя"));

    try {
        await models.Child.create({name, age, gender, parent_id: parentId});
    } catch (e) {
        return res.status(500).json(createError("Не могу создать"))
    }

    const children = await models.Child.findAll({where: {parent_id: parentId}});
    return res.status(200).json(createResponse(children));
}

export const updateChildren = async (req, res) => {
    const parentId = req.parentId;
    const {id, name, age, gender} = req.body;

    try {
        await models.Child.update({name, age, gender}, {where: {id, parent_id: parentId}});
    } catch (e) {
        return res.status(500).json(createError("Не могу обновить"))
    }

    const children = await models.Child.findAll({where: {parent_id: parentId}});
    return res.status(200).json(createResponse(children));
}

export const deleteChildren = async (req, res) => {
    const parentId = req.parentId;
    const childId = req.params.id;

    if (!parentId || !childId) return res.status(500).json(createError("Не достаточно аргументов"));

    try {
        await models.Child.destroy({where: {id: childId, parent_id: parentId}});
    } catch (e) {
        return res.status(500).json(createError("Не могу удалить ребенка"));
    }

    const children = await models.Child.findAll({where: {parent_id: parentId}});
    return res.status(200).json(createResponse(children));
}

export const setFavorite = async (req, res) => {
    const parentId = req.parentId;
    const {favorite_ids} = req.body;

    try {
        await models.Parent.update({favorite_ids}, {where: {id: parentId}})
    } catch (e) {
        res.status(500).json(createError("Не могу обновить пользователя"));
    }

    return res.status(200).json(createResponse(favorite_ids))
}

export const setCart = async (req, res) => {
    const parentId = req.parentId;
    const {cart} = req.body;

    try {
        await models.Parent.update({cart}, {where: {id: parentId}})
    } catch (e) {
        res.status(500).json(createError("Не могу обновить пользователя"));
    }

    return res.status(200).json(createResponse(cart))
}