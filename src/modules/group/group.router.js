import { Router } from "express";
import * as controller from "./group.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.middleware.js";
import { allUsers } from './group.role.js';
import { createGroupSchema, updateGroupSchema } from "./group.validation.js";
const router = Router();

router.post('/', fileUpload(fileMimeTypes.image).single('image'), asyncHandler(validation(createGroupSchema)), asyncHandler(auth(allUsers)), asyncHandler(controller.createGroup));
router.patch('/:id', fileUpload(fileMimeTypes.image).single('image'), asyncHandler(validation(updateGroupSchema)), asyncHandler(auth(allUsers)), asyncHandler(controller.updateGroup));

export default router;