import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const createCommentSchema = Joi.object({
    text: Joi.string().min(1).max(1000),
    image: generalFields.image.optional(),
    postId: generalFields.id
});
export const likeCommentSchema = Joi.object({
    postId: generalFields.id,
    commentId: generalFields.id
});
export const deleteCommentSchema = Joi.object({
    postId: generalFields.id,
    commentId: generalFields.id
});
export const updateCommentSchema = Joi.object({
    text: Joi.string().min(1).max(1000),
    image: generalFields.image.optional(),
    postId: generalFields.id,
    commentId: generalFields.id
});