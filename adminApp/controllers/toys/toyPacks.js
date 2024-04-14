import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";
import translit from "../../helpers/translit.js";

// Список категорий и пакетов
export const getCategoryList = async (req, res) => {
    const categories = await models.ToyPackCategory.findAll({
        include: [
            {model: models.ToyPack}
        ]
    },);
    res.status(200).json(createResponse(categories));
}

export const createCategoryPack = async (req, res) => {
    const {name_ru, name_kz, description_ru, description_kz, icon_mdi} = req.body;
    if (!name_ru || !name_kz || !description_ru || !description_kz) return res.status(500).json(createError("Не хватает аргументов"));

    const code = translit(name_ru);

    try {
        await models.ToyPackCategory.create({name_ru, name_kz, description_ru, description_kz, icon_mdi, code});
    } catch (e) {
        res.status(500).json(createError("Не могу создать"));
    }

    res.status(200).json(createResponse({status: "OK"}));
}

export const updateCategoryPack = async (req, res) => {
    const {id} = req.params;
    const {name_ru, name_kz, description_ru, description_kz, icon_mdi} = req.body;

    try {
        await models.ToyPackCategory.update({name_ru, name_kz, description_ru, description_kz, icon_mdi}, {where: {id}});
    } catch (e) {
        res.status(500).json(createError("Не могу обновить"));
    }

    res.status(200).json(createResponse({status: "OK"}));
}

export const deleteCategoryPack = async (req, res) => {
    const {id} = req.params;

    try {
        await models.ToyPack.destroy({where: {category_id: id}})
        await models.ToyPackCategory.destroy({where: {id}});
    } catch (e) {
        res.status(500).json(createError("Не могу удалить"));
    }

    res.status(200).json(createResponse({status: "OK"}));
}

export const createPack = async (req, res) => {
    const {name_ru, name_kz, description_ru, description_kz, list, category_id} = req.body;
    if (!name_ru || !name_kz || !description_ru || !description_kz || !category_id) return res.status(500).json(createError("Не хватает аргументов"));

    try {
        await models.ToyPack.create({name_ru, name_kz, description_ru, description_kz, list, category_id});
    } catch (e) {
        res.status(500).json(createError("Не могу создать"));
    }

    res.status(200).json(createResponse({status: "OK"}));
}

export const updatePack = async (req, res) => {
    const {id} = req.params;
    const {name_ru, name_kz, description_ru, description_kz, list} = req.body;

    try {
        await models.ToyPack.update({name_ru, name_kz, description_ru, description_kz, list}, {where: {id}});
    } catch (e) {
        res.status(500).json(createError("Не могу обновить"));
    }

    res.status(200).json(createResponse({status: "OK"}));
}

export const deletePack = async (req, res) => {
    const {id} = req.params;

    try {
        await models.ToyPack.destroy({where: {id}});
    } catch (e) {
        res.status(500).json(createError("Не могу удалить"));
    }

    res.status(200).json(createResponse({status: "OK"}));
}