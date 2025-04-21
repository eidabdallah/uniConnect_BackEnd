import { Router } from "express";
import * as controller from "./auth.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.middleware.js";
import { registerSchema } from "./auth.validation.js";
const router = Router();

router.post('/register', fileUpload(fileMimeTypes.image).single('image'),validation(registerSchema), asyncHandler(controller.register));

export default router;