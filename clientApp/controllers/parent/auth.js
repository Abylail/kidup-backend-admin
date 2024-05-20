import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";
import "dotenv/config";
import {generateToken} from "../../../helpers/generateAccessToken.js";
import {sendSmsService} from "../../../services/sendSms.js";

// Генерация случайных 4 чисел
const generateSmsCode = () => Math.floor(1000 + Math.random() * 9000);

export const sendSms = async (req, res) => {
    const {phone} = req.body;

    if (!phone) return res.status(500).json(createError("Нет телефона"))

    const smsCode = generateSmsCode();

    if (process.env.PROCESS_TYPE !== "test") {
        const smsSuccess = await sendSmsService(phone, `Ваш код для входа kidup: ${smsCode}`);
        if (!smsSuccess) return res.status(500).json(createError("Не удалось отправить смс"))
    }

    const smsConfirmOld = await models.SmsConfirm.findOne({where: {phone}})

    try {
        if (!smsConfirmOld) await models.SmsConfirm.create({phone, sms_code: smsCode})
        else await models.SmsConfirm.update({phone, sms_code: smsCode}, {where: {phone}})
    } catch (e) {
        return res.status(500).json(createError("Не могу отправить смс"))
    }

    if (process.env.PROCESS_TYPE === "test") return res.status(200).json({status: "OK", smsCode})
    return res.status(200).json({status: "OK"})
}

// Существует ли родитель
export const parentExist = async (req, res) => {
    const {phone} = req.body;
    if (!phone) return res.status(500).json(createError("Нет телефона"))
    return !!await models.Parent.findOne({where: {phone}});
}

// Проверить код смс
export const phoneSmsConfirm = async (req, res) => {
    const {phone, sms_code} = req.body;
    return await models.SmsConfirm.findOne({where: {phone, sms_code}})
}

export const phoneSmsAuth = async (req, res) => {
    const {phone, sms_code} = req.body;
    if (!phone || !sms_code) return res.status(500).json(createError("Отсутсвуют нужные атрибуты"));

    const smsConfirm = await models.SmsConfirm.findOne({where: {phone}});
    if (!smsConfirm) return res.status(500).json(createError("Смс не был отправлен"));

    const isCodeMatch = smsConfirm.dataValues.sms_code === sms_code;
    if (!isCodeMatch) return res.status(500).json(createError("Неверный код"));

    models.SmsConfirm.destroy({where: {phone}});
    const [parentUser, created] = await models.Parent.findOrCreate({
        where: {phone},
        defaults: {
            first_name: "Добрый",
            last_name: "Родитель"
        }
    })

    const token = generateToken({id: parentUser.dataValues.id, type: "parent"})

    return res.status(200).json(createResponse({...parentUser.dataValues, token, isNew: created}))
}

export const tokenAuth = async (req, res) => {
    const parentId = req.parentId;

    const parentUser = await models.Parent.findByPk(parentId, {
        attributes: {
            exclude: ["id", "createdAt", "updatedAt"]
        }
    });
    if (!parentUser) return res.status(401).json(createError("Пользователь не авторизован"));

    return res.status(200).json(createResponse(parentUser))
}