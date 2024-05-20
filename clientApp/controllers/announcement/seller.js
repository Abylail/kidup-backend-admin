import models from "../../../models/index.js";
import {createError, createResponse, createWhere} from "../../../helpers/responser.js";
import {uploadFile} from "../../../services/image.js";

export const getMyAnnouncements = async (req, res) => {
    const parentId = req.parentId;
    if (!parentId) return res.status(404).json(createError("Не найдено"))
    const {status} = req.query;
    const list = await models.Announcement.findAll({
        where: createWhere({
            seller_id: parentId,
            status,
        }),
        include: [
            {
                model: models.AnnouncementCategory,
                as: 'categories',
                attributes: {include: ["code"]},
                through: { attributes: [] }
            }
        ]
    })

    return res.status(200).json(createResponse(list));
}

// Создать объявление
export const createAnnouncement = async (req, res) => {
    const parentId = req.parentId;
    const announcementData = req.body || {};
    const {
        title, description, use_experience, brand, price, max_age, min_age,
        categories = [],
        photoBuffers = [],
    } = req.body;
    const status = "moderation";

    if (["title", "description", "use_experience", "price", "max_age", "min_age"].some(key => !announcementData[key])) return res.status(500).json(createError("Не хватает аргументов"));

    const categoriesData = await models.AnnouncementCategory.findAll({where: {code: categories}})
    if (!categories.length || !categoriesData?.length) return res.status(500).json(createError("Добавьте категории"));

    const filePathList = await Promise.all(photoBuffers.map(buffer => uploadFile(buffer, "announcement")));

    let announcement = null;

    // Создаю
    try {
        announcement = await models.Announcement.create({title, description, use_experience, brand, price, max_age, min_age: +min_age, status, seller_id: parentId, photos: filePathList});
    } catch (e) {
        return res.status(500).json(createError("Не могу создать"));
    }

    // Привязываю категории
    try {
        await announcement?.addCategories(categoriesData);
    } catch (e) {
        return res.status(500).json(createError("Не привязать объявление к категориям"));
    }

    await announcement.reload({include: [
            {
                model: models.AnnouncementCategory,
                as: 'categories',
                attributes: {include: ["code"]},
                through: { attributes: [] }
            }
        ]})

    res.status(200).json(createResponse({...announcement.dataValues}));
}

// Создать объявление
export const updateAnnouncement = async (req, res) => {
    const parentId = req.parentId;
    const {id} = req.params;
    const announcementData = req.body || {};

    const {
        title, description, use_experience, brand, price, max_age, min_age, photos,
        categories = [],
        photoBuffers = [],
    } = req.body;
    const status = "moderation";

    if (["title", "description", "use_experience", "price", "max_age", "min_age"].some(key => !announcementData[key])) return res.status(500).json(createError("Не хватает аргументов"));

    const categoriesData = await models.AnnouncementCategory.findAll({where: {code: categories}})
    if (!categories.length || !categoriesData?.length) return res.status(500).json(createError("Добавьте категории"));

    const announcement = await await models.Announcement.findOne({where: {id, seller_id: parentId}});
    if (!announcement) return res.status(404).json(createError("Не найдено"))

    // Создаю
    try {
        await announcement.update(
            {title, description, use_experience, brand, price, max_age, min_age, status, seller_id: parentId, photos},
        );
    } catch (e) {
        return res.status(500).json(createError("Не могу создать"));
    }

    // Привязываю категории
    try {
        await announcement?.setCategories(categoriesData);
    } catch (e) {
        console.log(e);
        return res.status(500).json(createError("Не могу привязать объявление к категориям"));
    }

    await announcement.reload({include: [
            {
                model: models.AnnouncementCategory,
                as: 'categories',
                attributes: {include: ["code"]},
                through: { attributes: [] }
            }
        ]})

    res.status(200).json(createResponse({...announcement.dataValues}));
}