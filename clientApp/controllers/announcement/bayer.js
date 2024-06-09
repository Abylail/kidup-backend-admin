
// Получить список объявлений
import models from "../../../models/index.js";
import {createResponse, createWhere} from "../../../helpers/responser.js";

export const getList = async (req, res) => {
    const {limit, offset, category, status} = req.query;
    const list = await models.Announcement.findAll({
        limit: +limit || undefined,
        offset: +offset || undefined,
        order: [['updatedAt', 'DESC']],
        where: createWhere({status}),
        include: [
            {
                model: models.AnnouncementCategory,
                as: 'categories',
                where: createWhere({code: category}),
                attributes: {exclude: ["id", "announcement_category", "createdAt", "updatedAt"]},
                through: { attributes: [] }
            }
        ]
    })

    return res.status(200).json(createResponse(list));
}

export const getListByIds = async (req, res) => {
    const {ids} = req.body;
    if (!Array.isArray(ids)) return res.status(200).json(createResponse([]))
    const list = await models.Announcement.findAll({
        where: {id: ids},
    })

    return res.status(200).json(createResponse(list));
}

export const getSingle = async (req, res) => {
    const {id} = req.params;
    const item = await models.Announcement.findByPk(id, {
        include: [
            {
                model: models.AnnouncementCategory,
                as: 'categories',
                attributes: {exclude: ["id", "announcement_category", "createdAt", "updatedAt"]},
                through: { attributes: [] }
            }
        ]
    })

    return res.status(200).json(createResponse(item));
}

export const getCategories = async (req, res) => {
    const list = await models.AnnouncementCategory.findAll({
        attributes: {exclude: ["id", "createdAt", "updatedAt"]}
    });
    return res.status(200).json(createResponse(list));
}

export const buy = async (req, res) => {
    const parentId = req.parentId;
    const {ids} = req.body;
    if (!Array.isArray(ids)) return res.status(200).json(createResponse([]))
    const list = await models.Announcement.findAll({
        where: {id: ids, status: "active"},
    })
    return res.status(200).json(createResponse({ok: "ok"}))
}