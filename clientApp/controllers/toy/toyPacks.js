import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";

// Список категорий и пакетов
export const getCategoryList = async (req, res) => {
    const categories = await models.ToyPackCategory.findAll({
        include: [
            {model: models.ToyPack}
        ]
    },);
    res.status(200).json(createResponse(categories));
}

// Список категорий и пакетов
export const getCategory = async (req, res) => {
    const {code} = req.params;
    const categories = await models.ToyPackCategory.findOne({
        where: {code},
        include: [
            {model: models.ToyPack}
        ]
    },);
    res.status(200).json(createResponse(categories));
}