import { Router } from "express";
import * as controller from "./post.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.middleware.js";
import { allUsers } from "./post.role.js";
import { createPostSchema, getPostSchema } from "./post.validation.js";

const router = Router();

router.post('/', fileUpload(fileMimeTypes.image).single('image'), asyncHandler(validation(createPostSchema)), asyncHandler(auth(allUsers)), asyncHandler(controller.createPost));
router.get('/', asyncHandler(auth(allUsers)), asyncHandler(controller.getHomeFeed));
export default router;