import { Router } from "express";
import * as controller from "./group.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.middleware.js";
import { allUsers } from './group.role.js';
import * as validationFunction from "./group.validation.js";
const router = Router();

router.get('/', asyncHandler(auth(allUsers)), asyncHandler(controller.getUserGroups));
router.get('/:slug', asyncHandler(validation(validationFunction.getGroupBySlugSchema)), asyncHandler(auth(allUsers)), asyncHandler(controller.getGroupBySlug));
router.post('/', fileUpload(fileMimeTypes.image).single('image'), asyncHandler(validation(validationFunction.createGroupSchema)), asyncHandler(auth(allUsers)), asyncHandler(controller.createGroup));
router.patch('/:id', fileUpload(fileMimeTypes.image).single('image'), asyncHandler(validation(validationFunction.updateGroupSchema)), asyncHandler(auth(allUsers)), asyncHandler(controller.updateGroup));
router.delete('/:id', asyncHandler(validation(validationFunction.deleteGroupSchema)), asyncHandler(auth(allUsers)), asyncHandler(controller.deleteGroup));

export default router;