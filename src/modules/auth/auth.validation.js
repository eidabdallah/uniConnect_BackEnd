import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";
import { CollegesList } from './../../utils/enum/colleges.js';

export const registerSchema = Joi.object({
    userName: generalFields.userName,
    email: generalFields.email.optional(),
    password: generalFields.password,
    universityId: generalFields.universityId,
    college: Joi.string().valid(...CollegesList).messages({
        "any.only": "Invalid college.",
        "any.required": "College is required.",
    }),
    gender: Joi.string().valid('Male', 'Female').required().messages({
        "any.only": "Gender must be either 'Male' or 'Female'.",
        "any.required": "Gender is required.",
    }),
    profileImage: generalFields.image.optional(),
});
export const loginSchema = Joi.object({
    universityId: generalFields.universityId,
    password: generalFields.password,
});
export const changePasswordSchema = Joi.object({
    universityId : generalFields.universityId,
    oldPassword : generalFields.password,
    newPassword : generalFields.password,
});
export const sendCodeSchema = Joi.object({
    email : generalFields.email,
    universityId : generalFields.universityId,
});

export const resetPasswordSchema = Joi.object({
    universityId : generalFields.universityId,
    email : generalFields.email,
    password : generalFields.password,
    code: Joi.string().required().length(6).messages({
        "string.required": "Code field is required.",
        "string.length": "Code is incorrect",
    }),
});