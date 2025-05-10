import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const createPostSchema = Joi.object({
    content: Joi.string().min(1).max(1000).messages({
        'string.base': 'Content must be a string.',
        'string.empty': 'Content cannot be empty.',
        'string.min': 'Content must be at least 1 character long.',
        'string.max': 'Content cannot exceed 1000 characters.'
    }),
    visibility: Joi.string().valid('public', 'friends-only').messages({
        'any.only': 'Visibility must be either "public" or "friends-only".',
        'string.base': 'Visibility must be a string.'
    }),
    image: generalFields.image.optional(),
    groupId: generalFields.id.optional(),
});
export const likePostSchema = Joi.object({
    id: generalFields.id,
});
export const deletePostSchema = Joi.object({
    id: generalFields.id,
});
export const updatePostSchema = Joi.object({
    id: generalFields.id,
    image: generalFields.image.optional(),
    content: Joi.string().min(1).max(1000).optional().messages({
        'string.base': 'Content must be a string.',
        'string.empty': 'Content cannot be empty.',
        'string.min': 'Content must be at least 1 character long.',
        'string.max': 'Content cannot exceed 1000 characters.'
    }),
});
