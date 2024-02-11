import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";
import {removeFile, uploadFile} from "../../../services/image.js";

export const getList = async (req, res) => {
    const roles = await models.Toy.findAll();
    res.status(200).json(createResponse(roles));
}

export const createToy = async (req, res) => {
    const {name_ru, name_kz, description_ru, description_kz, max_age, min_age, kaspiUrl, price, life_time} = req.body;

    try {
        await models.Toy.create({name_ru, name_kz, description_ru, description_kz, max_age, min_age, kaspiUrl, price, life_time});
    } catch (e) {
        res.status(500).json(createError("Не могу создать"));
    }

    res.status(200).json(createResponse({status: "OK"}));
}

export const updateToy = async (req, res) => {
    const {id} = req.params;
    const {name_ru, name_kz, description_ru, description_kz, max_age, min_age, kaspiUrl, price, photos, life_time} = req.body;

    try {
        await models.Toy.update({name_ru, name_kz, description_ru, description_kz, max_age, min_age, kaspiUrl, price, photos, life_time}, {where: {id}});
    } catch (e) {
        res.status(500).json(createError("Не могу создать"));
    }

    res.status(200).json(createResponse({status: "OK"}));
}

export const deleteToy = async (req, res) => {
    const {id} = req.params;

    try {
        await models.Toy.destroy({where: {id}});
    } catch (e) {
        res.status(500).json(createError("Не могу удалить"));
    }

    res.status(200).json({status: "OK"})
}

// Добавть картинку
export const addPhoto = async (req, res) => {
    const {id} = req.params;
    const toy = await models.Toy.findOne({where: {id}});
    if (!toy) return res.status(500).json(createError("Игрушка не найдена"));

    // Массив фоток
    let photos = toy.dataValues.photos || [];

    const {buffer} = req.body;
    const filePath = await uploadFile(buffer, "toy");
    if (!filePath) return res.status(500).json(createError("Не удалось загрузить файл"));
    photos.push(filePath);

    try {
        // Сохранение в базе новой картинки
        await models.Toy.update(
            {photos},
            {where: {id}}
        );
    } catch (e) {
        return res.status(500).json(createError("Не удалось сохранить файл"))
    }

    res.status(200).json({status: "OK"})
}

// Удалить картинку
export const removePhoto = async (req, res) => {
    const {id} = req.params;
    const toy = await models.Toy.findOne({where: {id}});
    if (!toy) return res.status(500).json(createError("Игрушка не найдена"));

    const {imagePath} = req.body;
    if (!imagePath) return res.status(500).json(createError("Нет ссылки на картинку"));

    let photos = toy.dataValues.photos || [];
    const photoIndex = photos.indexOf(imagePath);
    if (photoIndex > -1) {
        await removeFile(imagePath);
        photos.splice(photoIndex, 1);
    }

    try {
        // Сохранение в базе новой картинки
        await models.Toy.update(
            {photos},
            {where: {id}}
        );
    } catch (e) {
        return res.status(500).json(createError("Не удалось сохранить"))
    }

    res.status(200).json({status: "OK", photos})
}