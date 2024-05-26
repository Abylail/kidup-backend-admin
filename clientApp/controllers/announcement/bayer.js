
// Получить список объявлений
import models from "../../../models/index.js";
import {createResponse, createWhere} from "../../../helpers/responser.js";

export const getList = async (req, res) => {
    const {limit, offset, category} = req.query;
    const list = await models.Announcement.findAll({
        limit: +limit || undefined,
        offset: +offset || undefined,
        order: [['updatedAt', 'DESC']],
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

export const getCategories = async (req, res) => {
    const list = await models.AnnouncementCategory.findAll({
        attributes: {exclude: ["id", "createdAt", "updatedAt"]}
    });
    return res.status(200).json(createResponse(list));
}