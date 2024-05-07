import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";

export const setToySurvey = async (req, res) => {
    const parentId = req.parentId;
    const {answer} = req.body;

    if (!answer) return res.status(500).json(createError("Не хватает данных"));

    const isFirstSurvey = !(await models.ToySurvey.findOne({where: {parent_id: parentId}}));

    try {
        await models.ToySurvey.create({answer, parent_id: parentId});
        if (isFirstSurvey) await models.Parent.update({bonuses: 5000}, {where: {id: parentId}});
    } catch (e) {
        return res.status(500).json(createError("Не могу добавить ваш опрос"));
    }

    return res.status(200).json({status: "OK"});
}