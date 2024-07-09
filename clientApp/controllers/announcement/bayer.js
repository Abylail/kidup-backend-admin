
// Получить список объявлений
import models from "../../../models/index.js";
import {createError, createResponse, createWhere} from "../../../helpers/responser.js";

export const getList = async (req, res) => {
    const {limit, offset, category, status, city} = req.query;
    const list = await models.Announcement.findAll({
        limit: +limit || undefined,
        offset: +offset || undefined,
        order: [['updatedAt', 'DESC']],
        where: createWhere({status, city}),
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
    const {ids, needDisinfected} = req.body;
    if (!Array.isArray(ids) || typeof needDisinfected !== 'object') return res.status(500).json(createError("Неверные параметры"))

    const needDisinfectedIds = Object.keys(needDisinfected).filter(id => needDisinfected[id]);

    try {
        await models.Announcement.update({sell_date: new Date(), buyer_id: parentId, status: "waitingPayment"}, {where: {id: ids}})
        if (needDisinfectedIds.length > 0) await models.Announcement.update({need_disinfected: true}, {where: {id: needDisinfectedIds}})
        await models.Parent.update({cart: []}, {where: {id: parentId}});
    } catch (e) {
        console.log(e);
        return res.status(500).json(createError("Не могу обновить"))
    }

    return res.status(200).json({status: "OK"})
}

export const myPurchases = async (req, res) => {
    const parentId = req.parentId;
    const list = await models.Announcement.findAll({
        order: [['updatedAt', 'DESC']],
        where: createWhere({buyer_id: parentId}),
    })
    return res.status(200).json(createResponse(list));
}