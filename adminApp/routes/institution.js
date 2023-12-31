import express from "express";
import onlyAdmin from "../middlewares/onlyAdmin.js";
import {
    getList,
    create,
    update,
    deleteInstitution,
    getById,
    uploadLogo, addPhoto, removePhoto, enterAsInstitution
} from "../controllers/institution/institutionInfo.js";
import adminOrDirector from "../middlewares/adminOrDirector.js";
import {createSubject, deleteSubject, getSubjectList, updateSubject, addPhoto as addPhotoSubject, removePhoto as removePhotoSubject} from "../controllers/institution/institutionSubject.js";
import {
    createBranch,
    deleteBranch,
    getInstitutionBranchList,
    updateBranch
} from "../controllers/institution/institutionBranch.js";
import {createGroup, deleteGroup, getGroupList, updateGroup} from "../controllers/institution/institutionGroup.js";
import {getTrialRegistrations} from "../controllers/institution/trialRegistrations.js";
import {
    createTeacher,
    deleteTeacher,
    getTeacherList,
    updateTeacher, uploadTeacherPhoto
} from "../controllers/institution/institutionTeacher.js";

export default () => {
    const router = express.Router();

    // Контроль (круд) учреждения
    router.get("/get", onlyAdmin, getList);
    router.get("/get/:institution_id", adminOrDirector, getById);
    router.post("/create", onlyAdmin, create);
    router.put("/update/:institution_id", adminOrDirector, update);
    router.delete("/delete/:institution_id", adminOrDirector, deleteInstitution);

    // Зайти под учреждение
    router.get("/enter/:institution_id", onlyAdmin, enterAsInstitution);

    // Фото учреждения
    router.post("/update/:institution_id/upload/logo", adminOrDirector, uploadLogo);
    router.post("/update/:institution_id/upload/photo", adminOrDirector, addPhoto);
    router.post("/update/:institution_id/remove/photo", adminOrDirector, removePhoto);

    // Адреса
    router.get("/:institution_id/branch/get", getInstitutionBranchList);
    router.post("/:institution_id/branch/create", adminOrDirector, createBranch);
    router.put("/:institution_id/branch/update/:branch_id", adminOrDirector, updateBranch);
    router.delete("/:institution_id/branch/delete/:branch_id", adminOrDirector, deleteBranch);

    // Предметы
    router.get("/:institution_id/subject/get", adminOrDirector, getSubjectList);
    router.post("/:institution_id/subject/create", adminOrDirector, createSubject);
    router.put("/:institution_id/subject/update/:institution_subject_id", adminOrDirector, updateSubject);
    router.delete("/:institution_id/subject/delete/:institution_subject_id", adminOrDirector, deleteSubject);
    router.post("/:institution_id/subject/uploadPhoto/:institution_subject_id", adminOrDirector, addPhotoSubject);
    router.post("/:institution_id/subject/removePhoto/:institution_subject_id", adminOrDirector, removePhotoSubject);

    // Группы
    router.get("/:institution_id/group/get", getGroupList);
    router.post("/:institution_id/group/create", adminOrDirector, createGroup);
    router.put("/:institution_id/group/update/:institution_group_id", adminOrDirector, updateGroup);
    router.delete("/:institution_id/group/delete/:institution_group_id", adminOrDirector, deleteGroup);

    // Учителя
    router.get("/:institution_id/teacher/get", getTeacherList);
    router.post("/:institution_id/teacher/create", adminOrDirector, createTeacher);
    router.put("/:institution_id/teacher/update/:teacher_id", adminOrDirector, updateTeacher);
    router.delete("/:institution_id/teacher/delete/:teacher_id", adminOrDirector, deleteTeacher);
    router.post("/:institution_id/teacher/uploadPhoto/:teacher_id", adminOrDirector, uploadTeacherPhoto);

    // Записи на пробный
    router.get("/:institution_id/trialregistrations/get", adminOrDirector, getTrialRegistrations)

    return router;
}