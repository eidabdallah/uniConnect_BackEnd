import { Router } from "express";
import * as controller from "./auth.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.middleware.js";
import { changePasswordSchema, loginSchema, registerSchema } from "./auth.validation.js";
import { allUsers } from "./auth.role.js";
const router = Router();

router.post('/register', fileUpload(fileMimeTypes.image).single('image'),asyncHandler(validation(registerSchema)), asyncHandler(controller.register));
router.post('/login', asyncHandler(validation(loginSchema)), asyncHandler(controller.login));
router.get('/confirmEmail/:token' , asyncHandler(controller.confirmEmail));
router.patch('/changePassword', asyncHandler(validation(changePasswordSchema)), asyncHandler(auth(allUsers)), asyncHandler(controller.changePassword));
export default router;