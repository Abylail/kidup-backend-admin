import {Sequelize, Op} from "sequelize";
import 'dotenv/config';

import getRoleModel from "./role.js";
import getUserModel from "./user.js";
import getCategoryModel from "./category.js";
import getSubjectModel from "./subject.js";
import getInstitutionModel from "./institution.js";
import getParentModel from "./parent.js";
import getChildModel from "./child.js";
import getSmsConfirmModel from "./smsConfirm.js";
import getInstitutionSubjectModel from "./institutionSubject.js";
import getInstitutionGroupModel from "./institutionGroup.js";
import getInstitutionBranchModel from "./institutionBranch.js";
import getInstitutionTeacherModel from "./institutionTeacher.js";
import getTrialRegistrationModel from "./trialRegistration.js";
import getQuestionRequestModel from "./request.js";
import getToyModel from "./toys/toy.js";
import getToySubscribeRequestModel from "./toys/toySubscribeRequest.js";
import getToyCategoryModel from "./toys/toyCategory.js";
import getToySubscriberModel from "./toys/toySubscriber.js";
import getToyPackModel from "./toys/toyPack.js";
import getToyPackCategoryModel from "./toys/toyPackCategory.js";
import getToySurveyModel from "./toys/toySurvey.js";

const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    operatorsAliases: {
        $like: Op.like,
    },
    logging: false
});

const models = {
    Role: getRoleModel(sequelize),
    User: getUserModel(sequelize),

    Category: getCategoryModel(sequelize),
    Subject: getSubjectModel(sequelize),

    Parent: getParentModel(sequelize),
    Child: getChildModel(sequelize),
    SmsConfirm: getSmsConfirmModel(sequelize),

    Institution: getInstitutionModel(sequelize),
    InstitutionSubject: getInstitutionSubjectModel(sequelize),
    InstitutionGroup: getInstitutionGroupModel(sequelize),
    InstitutionBranch: getInstitutionBranchModel(sequelize),
    InstitutionTeacher: getInstitutionTeacherModel(sequelize),

    TrialRegistration: getTrialRegistrationModel(sequelize),

    QuestionRequest: getQuestionRequestModel(sequelize),

    Toy: getToyModel(sequelize),
    ToyCategory: getToyCategoryModel(sequelize),
    ToySubscribeRequest: getToySubscribeRequestModel(sequelize),
    ToySubscriber: getToySubscriberModel(sequelize),
    ToySurvey: getToySurveyModel(sequelize),

    ToyPack: getToyPackModel(sequelize),
    ToyPackCategory: getToyPackCategoryModel(sequelize),
}

// Связываю юзера и роли
models.User.belongsTo(models.Role, {foreignKey: "role_id"});

// Связываю предметы и категории
models.Subject.belongsToMany(models.Category, {through: "category_subject", as: "categories"});
models.Category.belongsToMany(models.Subject, {through: "category_subject", as: "subjects"});

// Связываю клиента (Родителя) и клиента (Ребенок)
models.Child.belongsTo(models.Parent, {foreignKey: "parent_id"});
models.Parent.hasMany(models.Child, {foreignKey: "parent_id", onDelete: 'cascade'});

// Связываю учереждение и директора
models.Institution.hasOne(models.User, {foreignKey: "institution_id", as: "director"});
models.User.hasOne(models.Institution, {foreignKey: "director_id", as: "institution" });

// Связываю учереждение и учителей
models.Institution.hasMany(models.InstitutionTeacher, {foreignKey: "institution_id"});
models.InstitutionTeacher.belongsTo(models.Institution, {foreignKey: "institution_id"});

// Связываю предметы и предметы центра
models.InstitutionSubject.belongsTo(models.Subject, {foreignKey: "subject_id"});
models.Subject.hasMany(models.InstitutionSubject, {foreignKey: "subject_id", onDelete: 'cascade'});

// Связываю учереждение и предметы центра
models.InstitutionSubject.belongsTo(models.Institution, {foreignKey: "institution_id"});
models.Institution.hasMany(models.InstitutionSubject, {foreignKey: "institution_id", onDelete: 'cascade'});

// Связываю группу с учреждением, адресом и предметом
models.InstitutionGroup.belongsTo(models.Institution, {foreignKey: "institution_id"});
models.Institution.hasMany(models.InstitutionGroup, {foreignKey: "institution_id", onDelete: 'cascade'});

// Связываю группу с учителем
models.InstitutionGroup.belongsTo(models.InstitutionTeacher, {foreignKey: "teacher_id"});
models.InstitutionTeacher.hasMany(models.InstitutionGroup, {foreignKey: "teacher_id"});

models.InstitutionGroup.belongsTo(models.InstitutionSubject, {foreignKey: "institution_subject_id"});
models.InstitutionSubject.hasMany(models.InstitutionGroup, {foreignKey: "institution_subject_id"});

models.InstitutionGroup.belongsTo(models.InstitutionBranch, {foreignKey: "institution_branch_id", onDelete: 'cascade'});

// Связываю адреса и центр
models.InstitutionBranch.belongsTo(models.Institution, {foreignKey: "institution_id"});
models.Institution.hasMany(models.InstitutionBranch, {foreignKey: "institution_id", onDelete: 'cascade'});

// Связываю регистрацию на пробный
models.TrialRegistration.belongsTo(models.InstitutionGroup, {foreignKey: "institution_group_id"})
models.InstitutionGroup.hasMany(models.TrialRegistration, {foreignKey: "institution_group_id"})
models.TrialRegistration.belongsTo(models.Institution, {foreignKey: "institution_id"})
models.Institution.hasMany(models.TrialRegistration, {foreignKey: "institution_id"})

models.TrialRegistration.belongsTo(models.Parent, {foreignKey: "parent_id"})
models.Parent.hasMany(models.TrialRegistration, {foreignKey: "parent_id"})

models.TrialRegistration.belongsTo(models.Child, {foreignKey: "child_id"})
models.Child.hasMany(models.TrialRegistration, {foreignKey: "child_id"})

// Связываю запросы
models.QuestionRequest.belongsTo(models.User, {foreignKey: "user_id"});
models.User.hasMany(models.QuestionRequest, {foreignKey: "user_id"});

// Связываю игрушки и категории
models.ToyCategory.belongsToMany(models.Toy, {through: "toy_category", as: "toys"});
models.Toy.belongsToMany(models.ToyCategory, {through: "toy_category", as: "categories"});

// Связываю пакет игрушек и категорию пакетов
models.ToyPack.belongsTo(models.ToyPackCategory, {foreignKey: "category_id"});
models.ToyPackCategory.hasMany(models.ToyPack, {foreignKey: "category_id", onDelete: 'cascade'});

// Свзяываю опрос с родителю
models.ToySurvey.belongsTo(models.Parent, {foreignKey: "parent_id"})

export {sequelize};

export default models;