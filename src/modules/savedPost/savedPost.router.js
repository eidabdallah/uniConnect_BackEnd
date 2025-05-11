import { Router } from "express";
import * as controller from "./savedPost.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import { allUsers } from "./savedPost.role.js";
import { checkIdSchema } from "./savedPost.validation.js";
const router = Router();

router.post('/toggle', asyncHandler(validation(checkIdSchema)), asyncHandler(auth(allUsers)), asyncHandler(controller.toggleSavedPost));
router.get('/saved', asyncHandler(auth(allUsers)), asyncHandler(controller.getSavedPosts));
router.get('/isSaved/:postId', asyncHandler(validation(checkIdSchema)), asyncHandler(auth(allUsers)), asyncHandler(controller.isPostSaved));

export default router;