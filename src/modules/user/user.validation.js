import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const updateUserInfoSchema = Joi.object({
    userName: generalFields.userName.optional(),
    bio: Joi.string().max(150).optional().messages({
        'string.base': 'Bio must be a string',
        'string.max': 'Bio must not exceed 150 characters',
    }),
});
export const changePicSchema = Joi.object({
    image : generalFields.image
});