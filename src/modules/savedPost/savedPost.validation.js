import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const checkIdSchema = Joi.object({
    postId: generalFields.id
});