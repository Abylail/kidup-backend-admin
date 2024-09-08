import models from "../../../models/index.js";
import {createError, createResponse, createWhere} from "../../../helpers/responser.js";
import {uploadFile, removeFile} from "../../../services/image.js";

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

export const getMyAnnouncement = async (req, res) => {
    const parentId = req.parentId;
    const {id} = req.params;

    if (!parentId) return res.status(404).json(createError("Не найдено"))
    const announcement = await models.Announcement.findOne({
        where: {
            id,
            seller_id: parentId,
        },
        include: [
            {
                model: models.AnnouncementCategory,
                as: 'categories',
                attributes: {include: ["code"]},
                through: { attributes: [] }
            }
        ]
    })

    if (!announcement) return res.status(404).json(createError("Не найдено"))

    return res.status(200).json(createResponse(announcement));
}

// Получить новый драфт пользователя
export const getDraftAnnouncement = async (req, res) => {
    const parentId = req.parentId;
    if (!parentId) return res.status(500).json(createError("Не авторизован"));

    const initData = {seller_id: parentId, status: "draft"};

    try {
        const [draft, created] = await models.Announcement.findOrCreate({
            where: initData,
            defaults: initData,
            include: [
                {
                    model: models.AnnouncementCategory,
                    as: 'categories',
                    attributes: {include: ["code"]},
                    through: { attributes: [] }
                }
            ]
        });

        return res.status(200).json(createResponse(draft));

    } catch (e) {
        return res.status(500).json(createError("Не могу создать черновик"));
    }
}

// Создать объявление
export const createAnnouncement = async (req, res) => {
    const parentId = req.parentId;
    const announcementData = req.body || {};
    const {
        title, description, use_experience, brand, price, max_age, min_age, city,
        categories = [],
    } = req.body;
    const status = "moderation";

    if (["title", "description", "use_experience", "price", "max_age", "min_age", "city"].some(key => !announcementData[key])) return res.status(500).json(createError("Не хватает аргументов"));

    const categoriesData = await models.AnnouncementCategory.findAll({where: {code: categories}})
    if (!categories.length || !categoriesData?.length) return res.status(500).json(createError("Добавьте категории"));

    let announcement = null;

    // Создаю
    try {
        announcement = await models.Announcement.create({title, description, use_experience, brand, price, max_age, min_age: +min_age, status, seller_id: parentId, photos: [], city});
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
        title, description, use_experience, brand, price, max_age, min_age, photos, city,
        categories = [],
    } = req.body;

    const announcement = await await models.Announcement.findOne({where: {id, seller_id: parentId}});
    if (!announcement) return res.status(404).json(createError("Не найдено"))

    const status = "draft";

    // Обновляю объявление
    try {
        await announcement.update(
            {title, description, use_experience, brand, price, max_age, min_age, status, seller_id: parentId, photos, city},
        );
    } catch (e) {
        return res.status(500).json(createError("Не могу создать"));
    }

    // Привязываю категории (если есть)
    if (categories.length) {
        try {
            const categoriesData = await models.AnnouncementCategory.findAll({where: {code: categories}})
            if (!categories.length || !categoriesData?.length) return res.status(500).json(createError("Добавьте категории"));
            await announcement?.setCategories(categoriesData);
        } catch (e) {
            return res.status(500).json(createError("Не могу привязать объявление к категориям"));
        }
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

// Опубликовать (отправить на модерацию)
export const publishDraft = async (req, res) => {
    const parentId = req.parentId;
    const {id} = req.params;

    await models.Announcement.update({status: "moderating"}, {where: {id, seller_id: parentId}})

    return res.status(200).json({status: "OK"})
}

// Добавить фото
export const addPhotoAnnouncement = async (req, res) => {
    const parentId = req.parentId;
    const {id} = req.params;
    const {buffer} = req.body;
    if (!parentId || !id || !buffer) return res.status(500).json(createError("Не хватает параметров"))

    const announcement = await models.Announcement.findOne({where: {id, seller_id: parentId}});
    if (!announcement) return res.status(500).json(createError("Объявление не найдено"));

    const filePath = await uploadFile(buffer, "announcement");
    const photos = announcement.dataValues.photos || [];
    photos.push(filePath);
    try {
        announcement.update({photos})
    } catch (e) {
        return res.status(500).json(createError("Не удается обновить объявление"));
    }

    return res.status(200).json(createResponse({photos}));
}

// Удалить фото
export const removePhotoAnnouncement = async (req, res) => {
    const parentId = req.parentId;
    const {id} = req.params;
    const {photoPath} = req.body;
    if (!parentId || !id || !photoPath) return res.status(500).json(createError("Не хватает параметров"))

    const announcement = await models.Announcement.findOne({where: {id, seller_id: parentId}});
    if (!announcement) return res.status(500).json(createError("Объявление не найдено"));

    const photos = announcement.dataValues.photos || [];
    try {
        if (photos.includes(photoPath)) {
            await removeFile(photoPath);
            const removeIndex = photos.indexOf(photoPath);
            photos.splice(removeIndex, 1);
            await announcement.update({photos})
        }
    } catch (e) {
        return res.status(500).json(createError("Не удается обновить объявление"));
    }

    return res.status(200).json(createResponse({photos}));
}

// Удалить объявление
export const deleteAnnouncement = async (req, res) => {
    const parentId = req.parentId;
    const {id} = req.params;

    const announcement = await models.Announcement.findOne({where: {id, seller_id: parentId}});
    const photos = announcement.dataValues.photos || [];
    await Promise.all(photos.map(path => removeFile(path)));
    await models.Announcement.destroy({where: {id, seller_id: parentId}});

    return res.status(200).json({status: "OK"})
}