import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const createPostSchema = Joi.object({
    content: Joi.string().min(1).max(1000),
    visibility: Joi.string().valid('public', 'friends-only'),
    image: generalFields.image.optional(),
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
    content: Joi.string().min(1).max(1000).optional(),
});
