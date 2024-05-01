import models from "../../models/index.js";
import {createError, createResponse} from "../../helpers/responser.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import {generateToken} from "../../helpers/generateAccessToken.js";
import {sendSmsService} from "../../services/sendSms.js";
import translit from "../helpers/translit.js";
import generateRandomHash from "../../helpers/generateRandomHash.js";

const generateAccessToken = (user_id, role_code) => {
    return jwt.sign({ id: user_id, role_code },  process.env.SECRET, { expiresIn: '24h' });
};

// Генерация случайных 4 чисел
const generateSmsCode = () => Math.floor(1000 + Math.random() * 9000);

// Отправить смс для авторизации
export const sendConfirmSms = async (req, res) => {
    const {phone} = req.body;

    if (!phone) return res.status(500).json(createError("Нет телефона"))

    const smsCode = generateSmsCode();

    const smsSuccess = await sendSmsService(phone, `Ваш код для входа kidup: ${smsCode}`);
    if (!smsSuccess) return res.status(500).json(createError("Не удалось отправить смс"))

    const smsConfirmOld = await models.SmsConfirm.findOne({where: {phone}})

    try {
        if (!smsConfirmOld) await models.SmsConfirm.create({phone, sms_code: smsCode})
        else await models.SmsConfirm.update({phone, sms_code: smsCode}, {where: {phone}})
    } catch (e) {
        return res.status(500).json(createError("Не могу отправить смс"))
    }

    return res.status(200).json({status: "OK"})
}

// Регистрация центра
export const centerRegister = async (req, res) => {
    const {
        first_name, last_name, phone, password, sms_code,
        center_name, start_time, end_time, call_phone, whatsapp_phone, description
    } = req.body;

    if (!phone || !sms_code || !first_name || !last_name || !password || !center_name || !start_time || !end_time || !call_phone || !whatsapp_phone || !description) return res.status(500).json(createError("Пожалуйта введите все данные"));

    const RoleCode = "center_director";
    const InstitutionTypeCode = "center";

    // Проверяю зарегестрирован ли он
    const user = await models.User.findOne({where: {phone}})
    if (user) return res.status(500).json(createError("Пользователь зарегестрирован"))

    // Проверяю смс код
    const smsConfirm = await models.SmsConfirm.findOne({where: {phone}});
    if (!smsConfirm) return res.status(500).json(createError("Смс не был отправлен"));
    const isCodeMatch = smsConfirm.dataValues.sms_code === sms_code;
    if (!isCodeMatch) return res.status(500).json(createError("Неверный смс код"));

    // Создаю пользователя
    try {
        await models.User.create({
            first_name,
            last_name,
            phone,
            password,
            role_code: RoleCode,
        })
    } catch (e) {
        return res.status(500).json(createError("Не могу создать пользователя"));
    }

    // Директор
    const director = await models.User.findOne({where: {phone}, include: [
            {model: models.Role, as: "role", attributes: ["title", "code"]}
        ],});

    // Создаю код для центра
    const centerCode = translit(center_name) + `-${generateRandomHash()}`;

    try {
        await models.Institution.create({
            name: center_name, code: centerCode, start_time, end_time, type: InstitutionTypeCode, director_id: director.id, call_phone, whatsapp_phone, description
        })
        const newCenter = await models.Institution.findOne({where: {code: centerCode}});
        await models.User.update({institution_id: newCenter.id}, {where: {phone}})
    } catch (e) {
        await models.User.destroy({where: {phone}})
        return res.status(500).json(createError("Не могу создать центр"))
    }

    // Директор
    const newUser = await models.User.findOne({where: {phone}, include: [
            {model: models.Role, as: "role", attributes: ["title", "code"]}
        ]
    });
    const token = generateToken({id: newUser.id, role_code: newUser.role?.code, institution_id: newUser.institution_id}) || generateAccessToken(newUser.id, newUser.role?.code);

    res.status(200).json(createResponse({...newUser.dataValues, password: undefined, token} ));
}

export const register = async (req, res) => {
    const {first_name, last_name, phone, password, role_code} = req.body;

    const user = await models.User.findOne({ where: { phone } })

    if (user) return res.status(500).json(createError("Пользователь существует"));

    try {
        await models.User.create({
            first_name,
            last_name,
            phone,
            password,
            role_code,
        })
    } catch (e) {
        return res.status(500).json(createError("Не могу создать пользователя"));
    }

    const newUser = await models.User.findOne({
        where: { phone },
        attributes: {exclude: ["updatedAt", "createdAt", "password"]}
    });

    res.status(200).json(createResponse(newUser));
}

export const login = async (req, res) => {
    const {phone, password} = req.body;
    const user = await models.User.findOne({
        where: { phone },
        include: [
            {model: models.Role, as: "role", attributes: ["title", "code"]}
        ],
        attributes: {exclude: ["updatedAt", "createdAt", "role_id"]}
    });

    if (!user) return res.status(404).json(createError("Пользователь не найден"))

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) return res.status(500).json(createError("Неверный логин или пароль"))

    const token = generateToken({id: user.id, role_code: user.role?.code, institution_id: user.institution_id}) || generateAccessToken(user.id, user.role?.code);

    res.status(200).json(createResponse({...user.dataValues, password: undefined, token} ));
}

export const tokenAuth = async (req, res) => {
    const { id } = req.user;
    const user = await models.User.findOne({
        where: { id },
        attributes: {exclude: ["updatedAt", "createdAt", "id", "password"]},
        include: [
            {model: models.Role, as: "role", attributes: ["title", "code"]}
        ],
    });

    if (!user) return res.status(401).json(createError("Пользователь не авторизован"));

    res.status(200).json(createResponse(user));
}

export const update = async (req, res) => {
    const { id } = req.user;
    const oldUser = await models.User.findOne({
        where: { id },
        attributes: {exclude: ["updatedAt", "createdAt", "id", "password"]}
    });

    const updateData = req.body;
    const dataForUpdate = {
        first_name: updateData.first_name || oldUser.dataValues.first_name,
        last_name: updateData.last_name || oldUser.dataValues.last_name,
        role_code: updateData.role_code || oldUser.dataValues.role_code,
    }
    try {
        await models.User.update(dataForUpdate, {where: {id}})
    } catch (e) {
        return res.status(500).json(createError("Не могу обновить пользователя"))
    }

    res.status(200).json(createResponse({...oldUser.dataValues, ...dataForUpdate}));
}
