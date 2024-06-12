import models from "../../../models/index.js";
import {createError, createResponse, createWhere} from "../../../helpers/responser.js";

export const getList = async (req, res) => {
    const {status} = req.query;
    const list = await models.Announcement.findAll({
        order: [['updatedAt', 'DESC']],
        where: createWhere({status}),
        include: [
            {
                model: models.Parent,
                foreignKey: "seller_id",
                as: "seller",
                attributes: ["phone", "first_name", "last_name"]
            },
            {
                model: models.Parent,
                foreignKey: "buyer_id",
                as: "buyer",
                attributes: ["phone", "first_name", "last_name"]
            },
            {
                model: models.AnnouncementCategory,
                as: 'categories',
                attributes: {exclude: ["id", "announcement_category", "createdAt", "updatedAt"]},
                through: { attributes: [] }
            }
        ]
    })

    return res.status(200).json(createResponse(list));
}

export const updateAnnouncement = async (req, res) => {
    const info = req.body;
    const {id} = req.params;

    try {
        await models.Announcement.update(info, {where: {id}});
    } catch (e) {
        return res.status(500).json(createError("Не могу обновить объявление"))
    }

    return res.status(200).json(createResponse(await models.Announcement.findByPk(id)))
}