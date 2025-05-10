import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const createGroupSchema = Joi.object({
    name: Joi.string().min(1).max(50).required().messages({
        'string.base': 'Name must be a string.',
        'string.empty': 'Name cannot be empty.',
        'string.min': 'Name must be at least 1 character long.',
        'string.max': 'Name cannot exceed 50 characters.',
        'any.required': 'Name is required.'
    }),
    description: Joi.string().min(1).max(50).optional().messages({
        'string.base': 'Description must be a string.',
        'string.empty': 'Description cannot be empty.',
        'string.min': 'Description must be at least 1 character long.',
        'string.max': 'Description cannot exceed 50 characters.'
    }),
    type: Joi.string().valid('public', 'private').messages({
        'any.only': 'Type must be either "public" or "private".',
        'string.base': 'Type must be a string.'
    }),
    image: generalFields.image.optional(),
});
export const updateGroupSchema = Joi.object({
    id: generalFields.id,
    name: Joi.string().min(1).max(50).optional().messages({
        'string.base': 'Name must be a string.',
        'string.empty': 'Name cannot be empty.',
        'string.min': 'Name must be at least 1 character long.',
        'string.max': 'Name cannot exceed 50 characters.',
        'any.required': 'Name is required.'
    }),
    description: Joi.string().min(1).max(50).optional().messages({
        'string.base': 'Description must be a string.',
        'string.empty': 'Description cannot be empty.',
        'string.min': 'Description must be at least 1 character long.',
        'string.max': 'Description cannot exceed 50 characters.'
    }),
    type: Joi.string().valid('public', 'private').messages({
        'any.only': 'Type must be either "public" or "private".',
        'string.base': 'Type must be a string.'
    }),
    image: generalFields.image.optional(),
});