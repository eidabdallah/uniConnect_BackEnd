import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const getUsersSchema = Joi.object({
    role: Joi.string().valid('admin', 'student', 'doctor', 'superAdmin').required().messages({
      'any.only': 'Role must be one of admin, student, doctor, or superAdmin',
      'any.required': 'Role is required',
      'string.base': 'Role must be a string'
    })
});
export const deleteUserSchema = Joi.object({
    id: generalFields.id
});
export const toggleStatusSchema = Joi.object({
    id: generalFields.id
});
export const registerAdminSchema = Joi.object({
    userName: generalFields.userName,
    email: generalFields.email,
    password: generalFields.password,
    universityId: generalFields.universityId
});
export const updateRoleSchema = Joi.object({
    id: generalFields.id,
    role: Joi.string().valid('admin', 'student', 'doctor', 'superAdmin').required().messages({
      'any.only': 'Role must be one of admin, student, doctor, or superAdmin',
      'any.required': 'Role is required',
      'string.base': 'Role must be a string'
    })
});