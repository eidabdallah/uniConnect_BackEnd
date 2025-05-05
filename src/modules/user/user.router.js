import { Router } from "express";
import * as controller from "./user.controller.js";
import { validation } from "../../middleware/validation.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { auth } from "../../middleware/auth.middleware.js";
import { allUsers } from "./user.role.js";
import { changePicSchema, updateUserInfoSchema } from "./user.validation.js";
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";

const router = Router();

router.get('/profile/:slug', asyncHandler(auth(allUsers)), asyncHandler(controller.getUserProfile));
router.patch('/', asyncHandler(validation(updateUserInfoSchema)), asyncHandler(auth(allUsers)), asyncHandler(controller.updateUserInfo));
router.patch('/changePic', fileUpload(fileMimeTypes.image).single('image'), asyncHandler(validation(changePicSchema)), asyncHandler(auth(allUsers)), asyncHandler(controller.updateUserPic));


export default router;