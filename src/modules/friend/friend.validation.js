import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const createFriendRequestSchema = Joi.object({
    receiverId: generalFields.id,
});
export const respondToFriendRequestSchema = Joi.object({
    requestId: generalFields.id,
    action: Joi.string().valid('accepted', 'rejected').required().messages({
        'any.only': 'Action must be either "accepted" or "rejected"',
        'any.required': 'Action is required'
    })
});
export const removeFriendOrCancelRequestSchema = Joi.object({
    targetId: generalFields.id.required(),
    action: Joi.string().valid("unfriend", "cancel").required()
});